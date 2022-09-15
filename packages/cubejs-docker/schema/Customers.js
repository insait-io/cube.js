cube(`Customers`, {
  sql: `SELECT * FROM public.customers`,

  preAggregations: {
    // Pre-Aggregations definitions go here
    // Learn more here: https://cube.dev/docs/caching/pre-aggregations/getting-started  
  },

  joins: {

  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [customerName, datetimeOriginallyCreated, datetimeRowInserted]
    },
  },

  dimensions: {

    customer_id: {
      sql: `customer_id`,
      type: `number`,
      primaryKey: true
    },

    balance: {
      sql: `balance`,
      type: `number`
    },

    age: {
      sql: `age`,
      type: `number`
    },

    isActive: {
      sql: `is_active`,
      type: `string`
    },

    customerDivision: {
      sql: `customer_division`,
      type: `string`
    },

    customerName: {
      sql: `customer_name`,
      type: `string`
    },

    customerType: {
      sql: `customer_type`,
      type: `string`
    },

    datetimeOriginallyCreated: {
      sql: `datetime_originally_created`,
      type: `time`
    },

    datetimeRowInserted: {
      sql: `datetime_row_inserted`,
      type: `time`
    }
  },

  dataSource: `postgres`
});
