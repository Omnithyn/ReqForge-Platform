-- Apache AGE Graph Setup for ReqForge
-- Run after AGE extension is installed: CREATE EXTENSION IF NOT EXISTS age; LOAD 'age';

-- Create graph
SELECT create_graph('reqforge_ontology');

-- Labels (vertices)
SELECT create_vlabel('reqforge_ontology', 'OntologyType');
SELECT create_vlabel('reqforge_ontology', 'Requirement');
SELECT create_vlabel('reqforge_ontology', 'BusinessRule');
SELECT create_vlabel('reqforge_ontology', 'DataField');
SELECT create_vlabel('reqforge_ontology', 'API');
SELECT create_vlabel('reqforge_ontology', 'TestCase');
SELECT create_vlabel('reqforge_ontology', 'Document');
SELECT create_vlabel('reqforge_ontology', 'Project');
SELECT create_vlabel('reqforge_ontology', 'Page');

-- Edge labels (relationships)
SELECT create_elabel('reqforge_ontology', 'INHERITS');
SELECT create_elabel('reqforge_ontology', 'EXTENDS');
SELECT create_elabel('reqforge_ontology', 'OVERRIDES');
SELECT create_elabel('reqforge_ontology', 'INSTANCE_OF');
SELECT create_elabel('reqforge_ontology', 'SOURCE_OF');
SELECT create_elabel('reqforge_ontology', 'HAS_RULE');
SELECT create_elabel('reqforge_ontology', 'CONSTRAINS');
SELECT create_elabel('reqforge_ontology', 'BELONGS_TO');
SELECT create_elabel('reqforge_ontology', 'DISPLAYS');
SELECT create_elabel('reqforge_ontology', 'USES');
SELECT create_elabel('reqforge_ontology', 'COVERS');
SELECT create_elabel('reqforge_ontology', 'IMPACTS');
SELECT create_elabel('reqforge_ontology', 'VERIFIES');
