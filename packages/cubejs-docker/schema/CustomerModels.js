cube(`CustomerModels`, {
  sql: `SELECT * FROM public.customer_models`,

  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started  
  },

  joins: {
    Customers: {
      sql: `${CUBE}.customer_id = ${Customers}.customer_id`,
      relationship: `belongsTo`
    },

    Agreements: {
      sql: `${CUBE}.customer_id = ${Agreements}.customer_id`,
      relationship: `belongsTo`
    }
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: []
    }
  },

  dimensions: {

    customer_id: {
      sql: `customer_id`,
      type: `number`,
      primaryKey: true
    },

    isBadCustomer: {
      sql: `is_bad_customer`,
      type: `string`
    },

    passiveTrends: {
      sql: `passive_trends`,
      type: `number`
    },

    avgSalarayLast4Months: {
      sql: `avg_salaray_last_4_months`,
      type: `number`
    },

    numActiveCreditCards: {
      sql: `num_active_credit_cards`,
      type: `number`
    },

    customerSector: {
      sql: `customer_sector`,
      type: `string`
    }
  },

  dataSource: `postgres`
});
