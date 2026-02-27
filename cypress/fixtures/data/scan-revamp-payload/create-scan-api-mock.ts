export const createScanEndpointRequest = {
  scan_name: "Test api",
  assignees: [
    "5973d6d7-7491-4d82-8a48-e943578e816b",
    "50877b5d-699a-48ad-a527-664bcb5149db",
  ],
  tags: ["01.08.00.029", "2025-03-05"],
  ports: {
    tcp: [],
    udp: [
      "53",
      "111",
      "123",
      "137",
      "161",
      "500",
      "2049",
      "3391",
      "5060",
      "30718",
    ],
  },
  targets: [
    {
      id: "1e957803-95c6-55f6-bf62-b97fab9250eb",
      target: "10.10.16.0/28",
      criticality: 2,
      tags: ["manual asset", "test", "test2", "test3"],
      is_registered: true,
      source: "discovered",
    },
    {
      target: "10.10.16.0",
      criticality: 1,
      tags: ["test", "abndev"],
      is_registered: false,
      source: "manual",
    },
  ],
  workers: {
    leaks: true,
    ports: true,
    vulnerabilities: true,
    screenshot_taker: true,
  },
  scan_type: "external",
  engine_config: {
    probe_engine: "qualys",
  },
  use_hostname: true,
  auto_remediate_issues: false,
  schedule: {
    start_date: "2025-03-05T06:42:00.000Z",
    end_date: null,
    schedule_type: "monthly",
    schedule_interval: 1,
    date_of_month: 1,
  },
};

export const createScanEndpointResponse = {
  status_code: 200,
  data: {
    config_id: "bfeede04-1817-44ee-a81a-8b6b85c100ca",
    scan_name: "Test api",
    org_id: "8f3bc068-7468-45f6-bf3d-9205c07731dc",
    scan_type: "external",
    network_id: "00000000-0000-0000-0000-000000000000",
    probe_id: "00000000-0000-0000-0000-000000000000",
    created_by: "50877b5d-699a-48ad-a527-664bcb5149db",
    engine_config: {
      probe_engine: "qualys",
      workers: {
        leaks: true,
        ports: true,
        vulnerabilities: true,
        screenshot_taker: true,
      },
    },
    auto_remediate_issues: false,
    updatedAt: "2025-03-05T06:46:49.747Z",
    createdAt: "2025-03-05T06:46:49.747Z",
  },
  client_message: null,
  error_detail: {
    server_message: null,
  },
};

export const updateScanEndpointResponse = {
  status_code: 200,
  data: {
    status: "success",
  },
  client_message: null,
  error_detail: {
    server_message: null,
  },
};

export const getScanScopeForUpdateScope = {
  status_code: 200,
  data: {
    config_id: "3e9e3437-65af-4705-946d-91b93b652c54",
    org_id: "474a2f6a-ca31-411a-ac27-bf92571642dc",
    created_by: "82f769c0-6c9d-4f30-a7cb-c0620e84c220",
    scan_name: "APP",
    scan_description: "",
    scan_type: "external",
    network_id: "00000000-0000-0000-0000-000000000000",
    probe_id: "00000000-0000-0000-0000-000000000000",
    connector_scan_source: null,
    connector_report_url: null,
    ab_engine_vhost: null,
    auto_assign: 0,
    use_hostname: 0,
    engine_config: {
      label: null,
      workers: {
        leaks: true,
        ports: true,
        vulnerabilities: true,
        screenshot_taker: true,
      },
      probe_engine: "qualys",
    },
    auto_remediate_issues: 1,
    targets: [
      {
        target_id: "Existing id on scan management",
        asset_id: null,
        target: "atb-playground.link",
        criticalit: 0,
        tags: [],
        source: "manual",
        cloud_hostname: "",
        cloud_source: "",
      },
      {
        target_id: "Existing id on scan management",
        asset_id: "Existing asset id on asset inventory",
        target: "atb-playground2.link",
        criticality: 0,
        tags: [],
        source: "discovered",
        cloud_hostname: "",
        cloud_source: "",
      },
    ],
    ports: {
      tcp: [],
      udp: ["5060", "3391", "30718", "137", "500", "123", "2049", "161", "111"],
    },
    assignees: ["1e39e345-4458-4bc6-bb3e-42090eb786ce"],
    tags: [],
    schedule: null,
  },
  client_message: null,
  error_detail: {
    server_message: null,
  },
};
