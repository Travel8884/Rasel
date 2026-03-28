-- Optional bootstrap SQL for PostgreSQL container startup.
-- Main schema is auto-created by SQLAlchemy on backend startup.

CREATE TABLE IF NOT EXISTS deployment_metadata (
  id SERIAL PRIMARY KEY,
  version VARCHAR(40) NOT NULL,
  deployed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO deployment_metadata(version)
VALUES ('v1.0.0')
ON CONFLICT DO NOTHING;
