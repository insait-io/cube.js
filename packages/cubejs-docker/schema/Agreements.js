cube(`Agreements`, {
  sql: `SELECT * FROM public.agreements`,

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
      drillMembers: [datetimeOriginallyCreated, datetimeRowInserted]
    }
  },

  dimensions: {

    agreement_id: {
      sql: `agreement_id`,
      type: `number`,
      primaryKey: true
    },


    customer_id: {
      sql: `customer_id`,
      type: `number`,
      primaryKey: true
    },


    agreementType: {
      sql: `agreement_type`,
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
