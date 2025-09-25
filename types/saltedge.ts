// SaltEdge AIS API v6 Types
// Based on: https://docs.saltedge.com/v6/api_reference#ais

export interface SaltEdgeCustomer {
  customer_id: string;
  identifier: string;
  categorization_type: string | null;
  blocked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SaltEdgeProvider {
  id: string;
  code: string;
  name: string;
  mode: 'api' | 'web' | 'oauth' | 'file';
  status: 'active' | 'inactive' | 'disabled';
  automatic_fetch: boolean;
  interactive: boolean;
  instruction: string;
  home_url: string;
  login_url: string;
  logo_url: string;
  country_code: string;
  created_at: string;
  updated_at: string;
  timezone: string;
  max_consent_days: number;
  supported_account_types: string[];
  supported_account_natures: string[];
  identification_mode: string;
  regulated: boolean;
}

export interface SaltEdgeConnection {
  id: string;
  secret: string;
  provider_id: string;
  provider_code: string;
  provider_name: string;
  customer_id: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive' | 'disabled';
  categorization: 'personal' | 'business';
  show_consent_confirmation: boolean;
  last_consent_id: string;
  last_attempt: {
    id: string;
    api_mode: string;
    api_version: string;
    automatic_fetch: boolean;
    user_present: boolean;
    daily_refresh: boolean;
    categorize: boolean;
    created_at: string;
    updated_at: string;
    success_at: string;
    fail_at: string;
    fail_message: string;
    fail_error_class: string;
    partial: boolean;
    store_credentials: boolean;
    include_natures: string[];
    exclude_accounts: string[];
    fetch_scopes: string[];
    from_date: string;
    to_date: string;
    stages: any[];
  };
  next_refresh_possible_at: string;
  store_credentials: boolean;
  country_code: string;
  holder_info: {
    names: string[];
    emails: string[];
    phone_numbers: string[];
    addresses: any[];
  };
}

export interface SaltEdgeAccount {
  id: string;
  name: string;
  nature: 'account' | 'bonus' | 'card' | 'checking' | 'credit' | 'credit_card' | 'debit_card' | 'ewallet' | 'insurance' | 'investment' | 'loan' | 'mortgage' | 'savings';
  balance: number;
  currency_code: string;
  connection_id: string;
  created_at: string;
  updated_at: string;
  extra: {
    account_name?: string;
    account_number?: string;
    iban?: string;
    swift?: string;
    sort_code?: string;
    routing_number?: string;
    bsb?: string;
    client_name?: string;
    available_amount?: number;
    blocked_amount?: number;
    credit_limit?: number;
    interest_rate?: number;
    account_type?: string;
    status?: string;
    card_type?: string;
    card_number?: string;
    expiry_date?: string;
    open_date?: string;
    closing_date?: string;
    current_date?: string;
    next_closing_date?: string;
    current_time?: string;
    nsf_fee?: number;
    partial?: boolean;
    product?: string;
    statements?: any[];
    transactions_count?: {
      posted?: number;
      pending?: number;
    };
  };
}

export interface SaltEdgeTransaction {
  id: string;
  duplicated: boolean;
  mode: 'normal' | 'fee' | 'transfer';
  status: 'posted' | 'pending';
  made_on: string;
  amount: number;
  currency_code: string;
  description: string;
  category: string;
  account_id: string;
  created_at: string;
  updated_at: string;
  extra: {
    account_balance_snapshot?: number;
    account_number?: string;
    additional?: string;
    asset_amount?: number;
    asset_code?: string;
    categorization_confidence?: number;
    check_number?: string;
    closing_balance?: number;
    constant_code?: string;
    convert?: boolean;
    customer_category_code?: string;
    customer_category_name?: string;
    end_to_end_id?: string;
    exchange_rate?: number;
    id?: string;
    information?: string;
    mcc?: string;
    merchant_id?: string;
    opening_balance?: number;
    original_amount?: number;
    original_category?: string;
    original_currency_code?: string;
    original_subcategory?: string;
    payee?: string;
    payee_information?: string;
    payer?: string;
    payer_information?: string;
    posting_date?: string;
    posting_time?: string;
    record_number?: string;
    specific_code?: string;
    tags?: string[];
    time?: string;
    transfer_account_name?: string;
    transfer_id?: string;
    type?: string;
    unit_price?: number;
    units?: number;
    variable_code?: string;
  };
}

export interface SaltEdgeAttempt {
  id: string;
  api_mode: string;
  api_version: string;
  automatic_fetch: boolean;
  user_present: boolean;
  daily_refresh: boolean;
  categorize: boolean;
  created_at: string;
  updated_at: string;
  success_at: string;
  fail_at: string;
  fail_message: string;
  fail_error_class: string;
  partial: boolean;
  store_credentials: boolean;
  include_natures: string[];
  exclude_accounts: string[];
  fetch_scopes: string[];
  from_date: string;
  to_date: string;
  stages: {
    name: string;
    created_at: string;
    updated_at: string;
    interactive_html?: string;
    interactive_fields_names?: string[];
  }[];
}

export interface SaltEdgeConsent {
  id: string;
  connection_id: string;
  status: 'given' | 'denied' | 'expired' | 'revoked';
  consent_types: string[];
  from_date: string;
  to_date: string;
  period_days: number;
  expires_at: string;
  collected_by: string;
  revoked_by: string;
  revoked_at: string;
  created_at: string;
  updated_at: string;
}

// API Request/Response Types
export interface CreateCustomerRequest {
  identifier: string;
}

export interface CreateCustomerResponse {
  data: SaltEdgeCustomer;
}

export interface ConnectSessionRequest {
  customer_id: string;
  consent: {
    scopes: string[];
    from_date?: string;
    to_date?: string;
    period_days?: number;
  };
  attempt: {
    return_connection_id?: boolean;
    return_error_class?: boolean;
    fetch_scopes?: string[];
    include_natures?: string[];
    exclude_accounts?: string[];
    from_date?: string;
    to_date?: string;
    categorize?: boolean;
    store_credentials?: boolean;
  };
  theme?: string;
  locale?: string;
  return_to?: string;
  provider_modes?: string[];
  country_codes?: string[];
  include_fake_providers?: boolean;
  provider_code?: string;
  disable_provider_search?: boolean;
  lost_connection_notify?: boolean;
  show_consent_confirmation?: boolean;
  credentials_strategy?: string;
}

export interface ConnectSessionResponse {
  data: {
    expires_at: string;
    connect_url: string;
  };
}

export interface ListConnectionsResponse {
  data: SaltEdgeConnection[];
  meta: {
    next_id: string;
    next_page: string;
  };
}

export interface ShowConnectionResponse {
  data: SaltEdgeConnection;
}

export interface ListAccountsResponse {
  data: SaltEdgeAccount[];
  meta: {
    next_id: string;
    next_page: string;
  };
}

export interface ListTransactionsResponse {
  data: SaltEdgeTransaction[];
  meta: {
    next_id: string;
    next_page: string;
  };
}

// Callback Types
export interface SaltEdgeSuccessCallback {
  data: {
    connection_id: string;
    customer_id: string;
    custom_fields?: Record<string, any>;
    stage: string;
  };
  meta: {
    version: string;
    time: string;
  };
}

export interface SaltEdgeFailureCallback {
  data: {
    connection_id?: string;
    customer_id: string;
    custom_fields?: Record<string, any>;
    error_class: string;
    error_message: string;
    stage: string;
  };
  meta: {
    version: string;
    time: string;
  };
}

export interface SaltEdgeNotifyCallback {
  data: {
    connection_id: string;
    customer_id: string;
    custom_fields?: Record<string, any>;
    stage: string;
  };
  meta: {
    version: string;
    time: string;
  };
}
