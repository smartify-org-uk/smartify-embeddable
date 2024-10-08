cube(`content_venue_detail`, {
    sql: `
          select
            sid as venue_sid
            ,"defaultName" as venue_name
            ,case when description is null then 'false' else 'true' end  as venue_description_exist
            ,ARRAY(SELECT jsonb_object_keys(description::jsonb)) AS venue_description_lang
            ,ARRAY(SELECT jsonb_object_keys(name::jsonb)) AS venue_name_lang
            ,case when location::jsonb->>'address' is null then 'false' else 'true' end  as geo_address_exist
            ,location::jsonb->>'continentName' as geo_continent
            ,location::jsonb->>'countryName' as geo_country
            ,location::jsonb#>>'{"cityName", "en-GB"}' as geo_city_en
            ,case when location::jsonb->>'cityName' is null then 'false' else 'true' end as geo_city_exist
            ,case when logo::jsonb#>>'{"dark", "s3Uri"}' is null then 'false' else 'true' end as logo_dark_exist
            ,case when logo::jsonb#>>'{"light", "s3Uri"}' is null then 'false' else 'true' end as logo_light_exist
            ,case when logo::jsonb#>>'{"dark", "s3Uri"}' = logo::jsonb#>>'{"light", "s3Uri"}' then 'true' else 'false' end as logo_dark_equals_light
            ,'Venues' as venue_string
          from content.hosts
          where type = 'venue'
        `,
    dataSource: 'smartify-postgres',
    measures: {
      records: {
        type: 'count'
      }
    },
    dimensions: {
      venue_sid: {
        type: 'string',
        sql: `venue_sid`,
        primaryKey: true,  // Define primary key here
        shown: true  // Hide this dimension from the user interface if necessary
      },
      venue_name: {
        type: 'string',
        sql: `venue_name`,
        shown: false
      },
      venue_description_exist: {
        type: 'string',
        sql: 'venue_description_exist'
      },
      venue_description_lang: {
        type: 'string',
        sql: 'venue_description_lang'
      },
      venue_name_lang: {
        type: 'string',
        sql: 'venue_name_lang'
      },
      geo_address_exist: {
        type: 'string',
        sql: 'geo_address_exist',
        title: 'Address Exist'
      },
      geo_continent: {
        type: 'string',
        sql: `case when geo_continent is null then '(not set)' else geo_continent end`,
        title: 'Continent'
      },
      geo_country: {
        type: 'string',
        sql: `case when geo_country is null then '(not set)' else geo_country end`,
        title: 'Country'
      },
      geo_city_en: {
        type: 'string',
        sql: `case when geo_city_en is null then '(not set)' else geo_city_en end`,
        title: 'City'
      },
      geo_city_exist: {
        type: 'string',
        sql: 'geo_city_exist',
        title: 'City Exist'
      },
      logo_dark_exist: {
        type: 'string',
        sql: 'logo_dark_exist'
      },
      logo_light_exist: {
        type: 'string',
        sql: 'logo_light_exist'
      },
      venue_string: {
        type: 'string',
        sql: 'venue_string'
      },
      logo_dark_equals_light: {
        type: 'string',
        sql: 'logo_dark_equals_light'
      }
    }
  });
  