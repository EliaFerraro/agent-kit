#!/usr/bin/env node
// Build (or check) a repo's GitHub Project from project-template.json.
//
//   node build-project.js --owner ferrarolabs --repo jamly --title Jamly [--extra extra-views.json]
//   node build-project.js --owner ferrarolabs --repo jamly --title Jamly --check
//
// Build is idempotent: it creates what is missing and leaves the rest.
// Check changes nothing: it diffs the live project against the template and
// runs each view's filter, so drift and broken filters show up as FAIL lines.
// The GitHub API can't set group-by, sort or workflows; those are printed as a
// manual checklist. Needs `gh` with the `project` scope.
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
    return acc;
  }, []),
);
for (const k of ['owner', 'repo', 'title']) if (!args[k]) throw new Error(`missing --${k}`);
const checkOnly = args.check === true;

const template = JSON.parse(fs.readFileSync(path.join(__dirname, 'project-template.json'), 'utf8'));
const extra = args.extra ? JSON.parse(fs.readFileSync(args.extra, 'utf8')) : { views: [] };
const views = [...template.views, ...extra.views];

const STATUS_COLORS = { Inbox: 'GRAY', Ready: 'BLUE', 'In progress': 'YELLOW', 'Needs me': 'RED', 'Device check': 'PURPLE', Done: 'GREEN' };

function gql(query, variables = {}) {
  const out = execFileSync('gh', ['api', 'graphql', '--input', '-'], {
    input: JSON.stringify({ query, variables }),
    encoding: 'utf8',
    maxBuffer: 1 << 26,
  });
  const j = JSON.parse(out);
  if (j.errors) throw new Error(JSON.stringify(j.errors));
  return j.data;
}
function rest(p) {
  return JSON.parse(execFileSync('gh', ['api', '--paginate', '--slurp', p], { encoding: 'utf8', maxBuffer: 1 << 26 })).flat();
}
const log = (...a) => console.log(...a);
let failures = 0;
const result = (ok, msg) => {
  if (!ok) failures++;
  log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`);
};

// ---- owner, repo, project
const { organization } = gql(
  `query($o:String!,$r:String!,$t:String!){ organization(login:$o){ id
     projectsV2(first:20, query:$t){ nodes{ id title number url } }
     repository(name:$r){ id } } }`,
  { o: args.owner, r: args.repo, t: args.title },
);
let project = organization.projectsV2.nodes.find((p) => p.title === args.title);
if (!project) {
  if (checkOnly) throw new Error(`project "${args.title}" not found`);
  project = gql(
    `mutation($o:ID!,$t:String!,$r:ID!){ createProjectV2(input:{ownerId:$o,title:$t,repositoryId:$r}){ projectV2{ id title number url } } }`,
    { o: organization.id, t: args.title, r: organization.repository.id },
  ).createProjectV2.projectV2;
  log(`created project ${project.url}`);
} else log(`project ${project.url}`);
const P = project.id;

if (!checkOnly) {
  gql(`mutation($p:ID!,$r:ID!){ linkProjectV2ToRepository(input:{projectId:$p,repositoryId:$r}){ clientMutationId } }`, {
    p: P,
    r: organization.repository.id,
  });
  gql(`mutation($p:ID!,$d:String!){ updateProjectV2(input:{projectId:$p,shortDescription:$d}){ clientMutationId } }`, {
    p: P,
    d: `Agent work on ${args.owner}/${args.repo}. Status is set from labels, never by hand.`,
  });
}

// ---- fields
const FIELDS_Q = `query($p:ID!){ node(id:$p){ ... on ProjectV2{ fields(first:50){ nodes{
  ... on ProjectV2FieldCommon{ id name dataType }
  ... on ProjectV2SingleSelectField{ options{ id name } } } } } } }`;
let fields = gql(FIELDS_Q, { p: P }).node.fields.nodes;
const field = (name) => fields.find((f) => f.name === name);

const status = field('Status');
const liveStatus = status.options.map((o) => o.name);
if (JSON.stringify(liveStatus) !== JSON.stringify(template.status)) {
  if (checkOnly) result(false, `Status options are [${liveStatus}], template says [${template.status}]`);
  else {
    gql(`mutation($f:ID!,$o:[ProjectV2SingleSelectFieldOptionInput!]){ updateProjectV2Field(input:{fieldId:$f,singleSelectOptions:$o}){ clientMutationId } }`, {
      f: status.id,
      o: template.status.map((name) => ({ name, color: STATUS_COLORS[name] || 'GRAY', description: '' })),
    });
    log('set Status options');
  }
} else result(true, 'Status options match');

for (const name of template.numberFields) {
  if (field(name)) result(true, `field "${name}"`);
  else if (checkOnly) result(false, `field "${name}" missing`);
  else {
    gql(`mutation($p:ID!,$n:String!){ createProjectV2Field(input:{projectId:$p,dataType:NUMBER,name:$n}){ clientMutationId } }`, { p: P, n: name });
    log(`created field "${name}"`);
  }
}

const orgIssueFields = gql(
  `query($o:String!){ organization(login:$o){ issueFields(first:50){ nodes{
     ... on IssueFieldSingleSelect{ id name } ... on IssueFieldDate{ id name }
     ... on IssueFieldText{ id name } ... on IssueFieldNumber{ id name } } } } }`,
  { o: args.owner },
).organization.issueFields.nodes;
for (const name of template.issueFields) {
  if (field(name)) result(true, `issue field "${name}"`);
  else if (checkOnly) result(false, `issue field "${name}" missing`);
  else {
    const f = orgIssueFields.find((x) => x.name === name);
    if (!f) throw new Error(`org has no issue field "${name}"`);
    gql(`mutation($p:ID!,$f:ID!){ createProjectV2IssueField(input:{projectId:$p,issueFieldId:$f}){ clientMutationId } }`, { p: P, f: f.id });
    log(`added issue field "${name}"`);
  }
}
fields = gql(FIELDS_Q, { p: P }).node.fields.nodes;

// ---- views
const VIEWS_Q = `query($p:ID!){ node(id:$p){ ... on ProjectV2{ views(first:30){ nodes{ id name number layout filter
  fields(first:30){ nodes{ ... on ProjectV2FieldCommon{ name } } } } } } } }`;
let liveViews = gql(VIEWS_Q, { p: P }).node.views.nodes;
for (const [i, v] of views.entries()) {
  const ids = v.fields.map((n) => {
    const f = field(n);
    if (!f) throw new Error(`view "${v.name}": unknown field "${n}"`);
    return f.id;
  });
  let live = liveViews.find((x) => x.name === v.name);
  if (checkOnly) {
    if (!live) { result(false, `view "${v.name}" missing`); continue; }
    result(live.layout === v.layout, `view "${v.name}" layout ${live.layout}`);
    result(live.filter === v.filter, `view "${v.name}" filter "${live.filter}"`);
    const liveFields = live.fields.nodes.map((f) => f.name);
    const missing = v.fields.filter((n) => !liveFields.includes(n));
    result(missing.length === 0, `view "${v.name}" fields${missing.length ? ' missing: ' + missing.join(', ') : ''}`);
    continue;
  }
  if (!live && i === 0) live = liveViews.find((x) => /^View \d+$/.test(x.name)); // reuse the default view
  if (!live) {
    live = gql(`mutation($p:ID!,$n:String!,$l:ProjectV2ViewLayout!){ createProjectV2View(input:{projectId:$p,name:$n,layout:$l}){ projectV2View{ id name } } }`, {
      p: P, n: v.name, l: v.layout,
    }).createProjectV2View.projectV2View;
    log(`created view "${v.name}"`);
  }
  gql(`mutation($v:ID!,$n:String!,$l:ProjectV2ViewLayout!,$f:String!,$ids:[ID!]){ updateProjectV2View(input:{viewId:$v,name:$n,layout:$l,filter:$f,configuration:{visibleFieldIds:$ids}}){ clientMutationId } }`, {
    v: live.id, n: v.name, l: v.layout, f: v.filter, ids,
  });
}

// ---- items: open issues and PRs, plus those closed in the last 30 days
const since = new Date(Date.now() - 30 * 864e5).toISOString();
const issues = rest(`repos/${args.owner}/${args.repo}/issues?state=all&since=${since}&per_page=100`).filter(
  (i) => i.state === 'open' || new Date(i.closed_at) > new Date(since),
);
const statusFor = (i) => {
  if (i.state === 'closed') return 'Done';
  const labels = i.labels.map((l) => l.name);
  const hit = template.statusFromLabels.find((m) => labels.includes(m.label));
  if (hit) return hit.status;
  if (i.pull_request && !i.draft) return 'Needs me'; // an open PR waits for review
  return 'Inbox';
};
if (!checkOnly) {
  const sf = fields.find((f) => f.name === 'Status');
  for (const i of issues) {
    const item = gql(`mutation($p:ID!,$c:ID!){ addProjectV2ItemById(input:{projectId:$p,contentId:$c}){ item{ id } } }`, { p: P, c: i.node_id })
      .addProjectV2ItemById.item;
    const want = statusFor(i);
    gql(`mutation($p:ID!,$i:ID!,$f:ID!,$o:String!){ updateProjectV2ItemFieldValue(input:{projectId:$p,itemId:$i,fieldId:$f,value:{singleSelectOptionId:$o}}){ clientMutationId } }`, {
      p: P, i: item.id, f: sf.id, o: sf.options.find((o) => o.name === want).id,
    });
  }
  log(`added ${issues.length} items and set their Status from labels`);
}

// ---- run every view's filter against the live items (the API evaluates it)
liveViews = gql(VIEWS_Q, { p: P }).node.views.nodes;
for (const v of views) {
  const n = gql(`query($p:ID!,$q:String!){ node(id:$p){ ... on ProjectV2{ items(first:100, query:$q){ totalCount } } } }`, { p: P, q: v.filter })
    .node.items.totalCount;
  log(`     view "${v.name}": ${n} item(s) for "${v.filter}"`);
}

if (!checkOnly) {
  log('\nManual steps (the API cannot set these):');
  for (const v of views) if (v.manual) log(`  - ${v.name}: ${v.manual}`);
  for (const w of template.workflows) log(`  - Workflow: ${w}`);
  log(`  Open: ${project.url}`);
}
if (checkOnly) log(failures ? `\n${failures} difference(s) from the template` : '\nproject matches the template');
process.exit(failures ? 1 : 0);
