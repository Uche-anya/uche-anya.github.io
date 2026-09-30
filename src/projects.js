export const projects = [
  {
    id: "northstar",
    name: "Northstar Carbon Intensity",
    title: "Northstar Carbon Intensity",
    categories: ["platform", "engineering", "analytics"],
    label: "DATABRICKS / CARBON INTENSITY",
    tags: ["Databricks", "GitHub Actions", "Terraform", "Unity Catalog"],
    repo: "northstar-databricks-platform",
    description:
      "A Databricks lakehouse for UK electricity carbon intensity. I built the ingestion, forecast reconciliation, daily reporting tables, and monitoring so the dashboard can distinguish published measurements from forecasts still awaiting confirmation.",
    problem:
      "The same half-hour interval can appear in several API responses, first as a forecast and later with an actual measurement. Reporting needs one consistent view of each interval, a clear account of what is still provisional, and daily totals that follow the UK calendar.",
    approach:
      "A Python collector saves each API response to a Unity Catalog Volume with its retrieval details and checksum. Auto Loader turns the immutable files into Bronze Delta records. Silver deduplicates by interval, prefers actual readings, and retains an actual-or-forecast status. Gold groups intervals by Europe/London date, accounting for the 46 or 50 half-hours on daylight-saving transition days. The dashboard reads Gold and the monitoring tables.",
    platform:
      "Databricks bundles define separate development, staging, and production targets. Pull requests run Python and Terraform checks. The final pipeline task checks duplicates, interval boundaries, daily coverage, and reconciliation totals, recording the evidence before failing a required rule. Retrieval runs outside Databricks because the Express workspace could not make the API request. Terraform also contains an account-level access-control design that requires Premium features and has not been applied.",
    result:
      "The repository records successful staging and first production runs, plus a published development dashboard showing intensity trends, actual-data coverage, and pipeline health. The production target is deployed but unscheduled to conserve trial credit. The manual operations workflow remains disabled pending credentials; feature engineering is a future extension.",
    flow: [
      "Carbon API",
      "Immutable landing",
      "Delta layers",
      "Quality evidence",
      "AI/BI dashboard",
    ],
    platforms: ["databricks"],
  },
  {
    id: "london",
    name: "London Environmental Monitor",
    title: "London Environmental Monitor",
    label: "AWS / AIR QUALITY & WEATHER",
    tags: ["AWS", "Terraform", "Docker", "GitHub Actions", "Grafana"],
    repo: "London-Environment-Time-Series",
    description:
      "An AWS pipeline joining hourly air-quality and weather data for London Bloomsbury. I built collection, transformation, quality checks, and Grafana reporting, with source ingestion running independently of the server that processes and displays the data.",
    problem:
      "To explore pollution alongside weather, the two sources need to agree on location and time. They also arrive on different schedules: DEFRA can revise readings, while the ERA5 weather archive is published several days later. Missing measurements must remain distinguishable from genuine zero readings.",
    approach:
      "Separate Lambdas refresh DEFRA and Open-Meteo ERA5 files in S3. DuckDB processes Bronze, Silver, and Gold Parquet datasets, normalises DEFRA’s end-of-day timestamps, and joins each hourly pollutant reading to weather for the same site. Invalid or missing values remain null. Great Expectations checks the daily summaries and hourly join before TimescaleDB is updated. Upserts let corrected source data replace existing records without creating duplicates.",
    result:
      "The documented production run on 31 July 2026 passed the quality gate and completed in 25 seconds, producing 280,896 hourly pollutant-and-weather rows for Grafana. The two collectors have independent schedules and error alarms. Downstream processing still requires EC2 to be running; alert delivery and stronger database recovery arrangements remain improvements to make.",
    flow: ["DEFRA + ERA5", "Lambda / S3", "DuckDB", "TimescaleDB", "Grafana"],
    categories: ["engineering", "platform", "analytics"],
    platform:
      "Terraform defines S3, Lambda, EventBridge schedules, IAM roles, CloudWatch alarms, ECR, and EC2. GitHub Actions tests the code and publishes Docker images using temporary AWS credentials through OIDC. A guarded cron job runs the processing container on EC2, while TimescaleDB and Grafana serve the results. Airflow provides a local development workflow; the smaller production host uses a lightweight runner.",
    platforms: ["aws"],
  },
  {
    id: "commerce",
    name: "Northstar Commerce / Lakebase",
    title: "Northstar Commerce / Lakebase",
    categories: ["engineering", "platform", "ml"],
    label: "LAKEBASE / COMMERCE & RECOMMENDATIONS",
    tags: ["FastAPI", "Lakebase", "Lakeflow", "MLflow"],
    repo: "Lakebase-ecommerce-platform-on-Databricks",
    description:
      "An e-commerce platform connecting transactional checkout in FastAPI and Lakebase to a Databricks lakehouse. I’m building the order workflow, event processing, analytical tables, and recommendations, using simulated application activity and public historical basket data.",
    problem:
      "Checkout needs an immediate, consistent answer about an order and its stock. Analytics needs the history of those changes, including late or repeated deliveries. I built the two sides together so order processing can continue independently of Spark, while downstream tables can be reconciled back to committed transactions.",
    approach:
      "FastAPI updates orders, inventory, and an outbox event in one PostgreSQL transaction. A separate publisher writes immutable event batches to a Unity Catalog Volume; Auto Loader and triggered Lakeflow pipelines process them through Bronze, Silver, and Gold. Silver handles duplicate delivery, event sequencing, conflicting updates, and customer and product history. Gold defines business measures and recommendation features. Historical Instacart data is a separate source; its users are not presented as customers of the simulated application.",
    platform:
      "The API, publisher, and pipeline share a versioned Python package. Ordered database migrations, publication leases, stable event identifiers, and reconciliation checks support recovery after a failed run. Spark ML trains a next-basket ranker; MLflow records evaluation and model versions. Batch shadow scoring and a small API canary exercise serving and feedback collection. The development deployment uses Databricks Free Edition and a Lakebase branch.",
    result:
      "The repository documents processing 37.29 million historical source rows and a completed Lakebase order-to-lakehouse run with reconciled events. The latest package records 402 passing local tests and seven opt-in database tests skipped. Recommendation comparisons are offline evaluations; canary feedback is simulated. Automated scheduling, environment promotion, production identities, recovery testing, and a business dashboard remain future work.",
    flow: [
      "FastAPI",
      "Lakebase / outbox",
      "Lakeflow",
      "Gold tables",
      "Spark ML / MLflow",
    ],
    platforms: ["databricks"],
    status: "Work in progress",
  },
  {
    id: "finance",
    name: "Massive Finance",
    title: "Massive Finance",
    label: "AZURE DATABRICKS / MARKET DATA",
    tags: ["Azure Databricks", "Pydantic", "Lakeflow", "GitHub Actions"],
    repo: "massive-api-databricks",
    description:
      "An Azure Databricks lakehouse for daily stock, crypto, and forex aggregates from Massive. I built a tested Python package for ingestion, validation, backfills, and Bronze-to-Gold processing, with reporting tables consumed by Power BI.",
    problem:
      "Market-data deliveries can contain malformed rows, missing fields, or corrections to earlier dates. Asset types also have different data and calendar rules. The pipeline needs to preserve rejected records for investigation and accept later corrections without duplicating the reporting data.",
    approach:
      "Pydantic validates the API payload before accepted records reach a Unity Catalog landing Volume. Auto Loader and Lakeflow build Bronze tables; PySpark deduplicates Silver by symbol and source date, retaining the latest delivery. Quality rules check required fields, consistent open/high/low/close prices, and appropriate volume values. Rejected rows retain their payload and failure details. Gold aggregates read only trusted Silver data.",
    result:
      "The project includes a Power BI dashboard and evidence of runs in separate Azure Databricks test and production workspaces. The latest package refactor has passed 12 local tests covering ingestion and Spark transformations. A fresh cloud deployment requires workspace access, so the latest local release is not presented as a newly verified production run.",
    flow: [
      "Massive API",
      "Validation",
      "Bronze",
      "Trusted silver",
      "Gold / BI",
    ],
    categories: ["engineering", "platform"],
    platform:
      "Databricks bundles install the same Python wheel into ingestion jobs and Lakeflow environments. The scheduled job runs ingestion before processing. GitHub Actions checks code, tests, and bundle configuration, with separate test and production deployment paths. Immutable run directories make corrected files discoverable; backfill planning includes crypto weekends, weekday stock and forex requests, and rate limits on retries.",
    platforms: ["azure", "databricks"],
  },
  {
    id: "rides",
    name: "Citibike Analytics",
    title: "Citibike Analytics",
    label: "DATABRICKS / CITIBIKE REPORTING",
    tags: ["Databricks", "PySpark", "Power BI"],
    repo: "RideSharing-Pipeline-DatabricksAssetBundles",
    description:
      "A Databricks lakehouse on Google Cloud that turns Citibike trip files into daily ride and station-performance reports. I built the transformations, reusable Python utilities, Power BI outputs, and deployment configuration for development, test, and production.",
    problem:
      "Trip-level CSV files need consistent dates, durations, and station groupings before they can answer questions about daily usage. This project follows that work through to reporting, while comparing a managed declarative pipeline with an explicitly ordered Databricks job.",
    approach:
      "CSV files in a GCS-backed Unity Catalog Volume become Bronze Delta records with run metadata. Silver uses packaged PySpark functions to calculate trip duration and trip date. Gold produces one table per day for ride counts and duration statistics, and another per day and starting station for station performance. The same transformations are implemented as Delta Live Tables and as a multi-task Databricks job.",
    result:
      "Two Power BI report assets show daily ride summaries and station performance from the Gold tables. The repository includes reusable transformation code, unit tests, and both orchestration definitions. It records development against a Databricks cluster; the deployed DLT option uses serverless compute. Service-account authentication is a planned improvement.",
    flow: ["GCS", "Bronze", "Silver", "Gold", "Power BI"],
    categories: ["engineering", "platform", "analytics"],
    platform:
      "Databricks Asset Bundles define jobs, compute, and three deployment targets, with Unity Catalog naming and access controls across environments. GitHub Actions runs unit tests on changes and defines promotion to test and then production. Shared logic is packaged as a wheel so the notebooks and tests use the same implementation.",
    platforms: ["databricks"],
  },
  {
    id: "azure",
    name: "Azure Lakehouse",
    title: "Azure Lakehouse",
    label: "AZURE / LAKEHOUSE INGESTION",
    tags: ["Azure Data Factory", "Databricks", "Synapse"],
    repo: "Dynamic-Data-Ingestion-Lakehouse-Pipeline-ADLS-Gen2-ADF-Synapse-",
    description:
      "An Azure lakehouse for AdventureWorks sales, customers, products, and returns. I used configuration-driven Data Factory ingestion, Databricks transformations, and Synapse SQL views to turn separate CSV files into datasets that can be queried together.",
    problem:
      "A reporting dataset is spread across several files with different formats and business entities. I wanted one reusable ingestion pattern for those files, followed by clear storage and transformation stages, instead of creating a separate pipeline for every table.",
    approach:
      "Data Factory uses Lookup, ForEach, and Copy activities to read file locations and destinations from configuration and land CSVs in ADLS Gen2 Bronze storage. Databricks standardises dates, names, columns, and product fields, then writes compressed Parquet to Silver. Synapse SQL exposes Gold views over sales, returns, customers, products, calendar, and territory data, with external-table scripts for the serving layer.",
    result:
      "The repository contains source datasets, transformation code, and Synapse SQL definitions. The completed scope reaches queryable lakehouse tables and views. A Power BI dashboard, additional quality checks, partitioning, and automated deployment are listed as future improvements.",
    flow: ["GitHub CSV", "Data Factory", "ADLS Gen2", "Databricks", "Synapse"],
    categories: ["engineering"],
    platform:
      "The architecture separates orchestration in Data Factory, file storage in ADLS Gen2, Spark transformation in Databricks, and SQL access in Synapse. The ingestion parameters can be reused for additional files. Databricks storage access uses a service principal, and the Synapse external-table example uses managed identity.",
    platforms: ["azure"],
  },
  {
    id: "air",
    name: "Snowflake Air Quality Pipeline",
    title: "Snowflake Air Quality Pipeline",
    label: "SNOWFLAKE / AIR QUALITY",
    tags: ["Snowflake", "Snowpark", "Streamlit"],
    repo: "Air-quality-pipeline-on-Snowflake",
    description:
      "A Snowflake pipeline for exploring public air-quality observations across India. I modelled API records into location and time-based reporting tables and built Streamlit views for city trends, station comparisons, and maps.",
    problem:
      "The source arrives as nested JSON with pollutant readings distributed across monitoring stations. To compare places and dates, the records need to be flattened, linked to consistent location and time dimensions, and aggregated at an explicit reporting level.",
    approach:
      "Python and Snowpark retrieve government API data and upload JSON to a Snowflake stage. SQL cleaning and flattening feed air-quality facts with location and date dimensions. Dynamic tables calculate hourly and daily city aggregates, and Streamlit reads those outputs for trends and geographic views. The repository also includes a historical sample loaded directly through Snowsight.",
    result:
      "The repository includes ingestion code, sample data, SQL transformations, and five Streamlit scripts. It provides the pieces for ingestion-to-dashboard analysis; a currently operating scheduled service has not been verified. The hourly workflow example still needs to be configured and installed as an active GitHub Actions workflow.",
    flow: ["Public API", "Snowpark", "Snowflake", "SQL models", "Streamlit"],
    categories: ["engineering", "analytics"],
    platform:
      "Snowflake handles storage, SQL transformation, and dynamic-table refreshes. Streamlit supplies the reporting interface. An hourly GitHub Actions schedule is supplied as an example under the repository’s workflow examples folder, rather than an active .github/workflows configuration.",
    platforms: ["snowflake"],
  },
  {
    id: "cricket",
    name: "Snowflake Cricket ELT",
    title: "Snowflake Cricket ELT",
    categories: ["engineering", "analytics"],
    platforms: ["snowflake"],
    label: "SNOWFLAKE / CRICKET MATCH DATA",
    tags: ["Snowflake", "SQL", "Streams & Tasks"],
    repo: "Cricket-Match-Data-Pipeline-Snowflake-ELT",
    description:
      "A Snowflake ELT pipeline that turns nested cricket-match JSON into match and ball-by-ball analysis tables. I built the flattening logic, dimensional model, and incremental task chain using Snowflake Streams and Tasks.",
    problem:
      "Match files contain teams, players, overs, and deliveries nested inside one document. Match summaries and individual-ball analysis require different table grains. The project separates those records and relates them through shared dimensions so new files can be added without rebuilding everything.",
    approach:
      "A scheduled COPY INTO task loads JSON from an internal stage and retains source-file metadata. Separate streams feed SQL transformations using LATERAL FLATTEN for match, player, and delivery records. The consumption layer has a match fact and a delivery fact linked to team, player, venue, and date dimensions. Anti-joins exclude match records already loaded into the facts.",
    platform:
      "Snowflake Tasks express the processing dependencies, and stream checks limit downstream work to available changes. The initial load is defined on a five-minute schedule. Ingestion, transformation, and incremental population run inside Snowflake, with file metadata available to trace the analytical rows back to their source.",
    result:
      "The repository documents the raw-to-consumption SQL workflow and the two fact-table grains. The current scope is the analytical data model and its task chain. Transformation test suites, failure notifications, and a BI dashboard are proposed extensions.",
    flow: [
      "Staged JSON",
      "Raw table",
      "Streams / Tasks",
      "SQL transforms",
      "Facts & dimensions",
    ],
  },
  {
    id: "dbt",
    name: "dbt Models on Snowflake",
    title: "dbt Models on Snowflake",
    categories: ["engineering", "analytics"],
    platforms: ["snowflake"],
    label: "SNOWFLAKE / DBT MODELLING",
    tags: ["Snowflake", "dbt", "SQL", "Data quality"],
    repo: "Illustrating-dbt-transformations-on-snowflake",
    description:
      "A dbt modelling project on Snowflake for customer orders and revenue. I built staging models, order-level facts, a customer revenue mart, and data tests, with snapshots to retain changes in customer records.",
    problem:
      "Customer, order, and order-item tables need consistent keys and a clear reporting grain before their totals can be reused. This project develops that modelling layer and makes the dependencies, assumptions, and quality checks visible in code.",
    approach:
      "Staging models prepare customer and order data from Snowflake landing tables. An order fact aggregates line-item revenue to one row per order; a customer mart then totals revenue and order counts by customer. YAML tests cover unique order identifiers, required keys, accepted statuses, and order-item relationships. A customer snapshot uses update timestamps to retain historical versions.",
    platform:
      "The project uses the Snowflake dbt adapter, source declarations, reusable SQL macros, and seeded reference data. The repository includes model execution, testing, snapshotting, and documentation commands, plus a custom check for empty strings and a test for negative order revenue.",
    result:
      "The repository contains the models, tests, customer-history snapshot, and setup instructions. This is a modelling exercise rather than a verified live reporting service. A store-target comparison is also included as exploratory SQL; its aggregation grain needs review before using it in business reporting.",
    flow: ["Landing tables", "dbt staging", "Model tests", "Reporting marts"],
  },
  {
    id: "fema",
    name: "FEMA Claims Intelligence",
    title: "FEMA Claims Intelligence",
    status: "Work in progress",
    categories: ["engineering", "ml"],
    platforms: [],
    label: "FEMA / CLAIMS DOCUMENTS",
    tags: [
      "FEMA data",
      "Document extraction",
      "Ollama (in progress)",
      "Retrieval QA (in progress)",
    ],
    repo: null,
    description:
      "A local-first insurance claims pipeline that checks structured records against PDFs and emails, flagging discrepancies with traceable source evidence. I’m developing it with public FEMA data and synthetic claim documents, and adding local LLM extraction and retrieval-based question answering.",
    problem:
      "A claim can be described differently in a structured record, a PDF, and an email. The useful output is a discrepancy that a person can investigate with its supporting source material. Public FEMA data and synthetic documents let me develop that review workflow without using private claimant files.",
    flow: [
      "FEMA records",
      "PDFs / emails",
      "Validation & extraction",
      "Discrepancies",
      "Source evidence",
    ],
    approach:
      "The current pipeline ingests and validates structured records, extracts information from PDFs and emails, and compares the extracted fields with the records. Discrepancies retain traceable source evidence so a reviewer can check the original material. The documents are synthetic; this is a development workflow, not a deployed insurance decision system.",
    platform:
      "The proposed deployment is a containerised batch-processing system with persistent storage, versioned model runs, automated evaluation, and monitoring. A human review interface would bring the flagged records and supporting evidence together. These are deployment plans, not completed operating capabilities.",
    result:
      "I’m extending extraction with local models through Ollama and adding retrieval-based question answering over the source material. Both are in progress. The next engineering work is to evaluate extraction quality, retain the model and run history, and make the review workflow usable.",
    approachHeading: "Current pipeline",
    platformHeading: "Proposed deployment",
    resultHeading: "Extensions in progress",
    sourceNote:
      "Uses public FEMA data and synthetic claim documents. Diagram is illustrative.",
  },
  {
    id: "hedge-fund",
    name: "Northbridge — Hedge Fund Data Platform",
    title: "Northbridge: Hedge Fund Data Platform",
    status: "Work in progress",
    categories: ["engineering", "analytics"],
    platforms: ["snowflake"],
    label: "SNOWFLAKE / FUND ACCOUNTING",
    tags: ["Snowflake", "dbt", "Python", "Massive market data"],
    repo: null,
    description:
      "A Snowflake and dbt platform for reconstructing a fund’s holdings, cash, and daily value. I’m combining real market prices and corporate actions with simulated trades and broker confirmations, with checks on settlement and dividend accounting.",
    problem:
      "A fund needs a daily account of what it owns, what those positions are worth, which payments have settled, and which differences need investigation. Trading activity, market prices, corporate actions, and broker confirmations describe different parts of that picture and need to reconcile.",
    flow: [
      "Trades / confirmations",
      "Massive market data",
      "Snowflake",
      "dbt models",
      "Holdings / cash / NAV",
    ],
    approachHeading: "Business problem & data sources",
    approach:
      "Python collects historical prices and corporate actions from Massive and generates fictional fund activity for a controlled replay. Snowflake stores the inputs, and dbt builds holdings, settlement, cash, valuation, and simplified net asset value models. Ticker-history repairs use identity evidence. The market data is real; trades and account confirmations are simulated. This is an independent development project.",
    platformHeading: "Implemented & checked",
    platform:
      "I’ve loaded about 250,000 historical price records across 503 tickers and repaired selected histories after checking evidence of ticker changes. The replay covers 23 trading days, 20 stocks, two accounts, and 3,200 fictional trades. Models calculate holdings, valuations, settlement, cash, and simplified NAV. A Mastercard dividend is followed from expected entitlement through a simulated confirmation into cash, without counting the income twice. Tests and an independent Python calculation check the Snowflake results.",
    resultHeading: "Development status & next steps",
    result:
      "This is a historical replay in development. Next I want to make the daily run repeatable, handle missing or late records, and add orchestration and ingestion automation. Unattended production operation is still ahead. Any later ML work will label synthetic cases explicitly and evaluate them separately from real-world performance.",
    sourceNote:
      "Real market data; simulated trades and account confirmations. Figures describe the development replay.",
  },
];
