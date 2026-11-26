import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const shared = 'activities/dsy1102-practice-shared/';
const read = path => readFileSync(join(root, path), 'utf8');
const parse = path => JSON.parse(read(path));
const banks = [...parse(shared + 'banks-01-08.json'), ...parse(shared + 'banks-09-14.json')];
const labs = parse(shared + 'labs.json');
const catalog = parse('catalog.json');
assert.equal(catalog.schemaVersion, 2);
assert.equal(banks.length, 13);
assert.equal(banks.reduce((sum, bank) => sum + bank.count, 0), 47);
assert.equal(labs.length, 12);
assert.equal(labs.reduce((sum, lab) => sum + lab.count, 0), 48);
assert.equal(new Set(catalog.activities.map(item => item.id)).size, catalog.activities.length);
assert.equal(new Set(catalog.activities.map(item => item.path)).size, catalog.activities.length);
const topics = new Set(catalog.topics.map(topic => topic.id));

for (const entry of [...banks, ...labs]) {
    const item = catalog.activities.find(item => item.id === entry.id);
    assert.ok(item, 'missing catalog entry ' + entry.id);
    assert.equal(item.path, entry.path);
    assert.ok(item.courseCodes.includes('DSY1102'));
    assert.ok(item.topicIds.every(topic => topics.has(topic)));
    assert.equal(item.status, 'published');
    assert.equal(item.evidence, 'txt');
    const html = read(entry.path.slice(1) + 'index.html');
    assert.equal((html.match(/<article data-item /g) || []).length, entry.count);
    assert.equal((html.match(/<textarea [^>]*data-solution/g) || []).length, entry.count);
    assert.equal((html.match(/<textarea [^>]*data-proof/g) || []).length, entry.count);
    assert.equal((html.match(/data-confirm disabled/g) || []).length, entry.count);
    assert.ok(html.includes('data-source="' + entry.source + '"'));
    assert.ok(html.includes('data-activity="' + entry.id + '"'));
    assert.ok(html.includes('progress max="' + entry.count + '"'));
    assert.ok(html.includes('id="export"'));
    assert.ok(html.includes('id="clear"'));
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, 'duplicate id in ' + entry.id);
    for (const match of html.matchAll(/\bfor="([^"]+)"/g)) {
        assert.ok(ids.includes(match[1]), 'unbound label in ' + entry.id);
    }
    for (const match of html.matchAll(/href="#([^"]+)"/g)) {
        assert.ok(ids.includes(match[1]), 'missing anchor in ' + entry.id);
    }
    assert.equal(entry.autonomous, true, 'autonomy required: ' + entry.id);
    assert.ok(!html.toLowerCase().includes('github.com/cmartinezs'), 'personal repository dependency: ' + entry.id);
    assert.equal(entry.source, 'https://academic-labs.adumun.cl' + entry.path);
    assert.ok(entry.provenance?.source, 'missing editorial provenance');
    assert.ok(html.includes('data-version="' + item.version + '"'), 'version mismatch: ' + entry.id);
    for (const resource of entry.resources || []) {
        assert.ok(resource.startsWith('codigo/') && !resource.includes('..'), 'invalid resource path');
        assert.ok(existsSync(join(root, entry.path.slice(1), resource)), 'missing resource: ' + resource);
        assert.ok(html.includes('href="' + resource + '"'), 'unlinked resource: ' + resource);
    }
    for (const step of entry.steps || []) {
        assert.ok(html.includes(step.source), 'missing source step in ' + entry.id);
    }
}
for (const file of ['practice.js', 'practice.css']) {
    assert.ok(existsSync(join(root, shared, file)));
}
console.log('PASS: 13 banks, 47 exercises, 12 hybrid labs, 25 autonomous entries, 48 lab checkpoints, local resources and static DOM contracts.');
