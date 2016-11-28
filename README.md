##clinical:hl7-resource-bundle

HL7 FHIR Resource - Bundle


===============================
#### Conformance Statement  

The resource in this package implements the FHIR Patient Resource schema provided at  [https://www.hl7.org/fhir/Bundle.html](https://www.hl7.org/fhir/Bundle.html).  


===============================
#### Installation  

````bash
# to add hl7 resource schemas and rest routes
meteor add clinical:hl7-resource-bundle

# to initialize default data
INITIALIZE=true meteor
````

===============================
#### Example   

```js
var nyQuill = {
  code: {
    text: "NyQuill"
  },
  isBrand: true,
  manufacturer: {
    display: 'VICKS',
    reference: ''
  },
  product: {
    form: {
      text: 'liquid'
    },
    ingredient: [{
      item: {
        resourceType: 'Substance',
        code: {
          text: 'Acetaminophen'
        },
        description: 'Pain reliever/fever reducer.'
      },
      instance: [{
        quantity: '650 mg'
      }]
    },{
      item: {
        resourceType: 'Substance',
        code: {
          text: 'Dextromethorphan HBr'
        },
        description: 'Cough suppressant.'
      },
      instance: [{
        quantity: '30 mg'
      }]
    },{
      item: {
        resourceType: 'Substance',
        code: {
          text: 'Doxylamine succinate'
        },
        description: 'Antihistamine.'
      },
      instance: [{
        quantity: '12.5 mg'
      }]
    }]
  },
  package: {
    container: {
      text: 'vial'
    },
    content: [{
      amount: {
        value: 12,
        unit: 'fl oz'
      }
    }]
  }
}
Bundles.insert(nyQuill);
```

===============================
#### Extending the Schema

```js
ExtendedBundleSchema = new SimpleSchema([
  BundleSchema,
  {
    "createdAt": {
      "type": Date,
      "optional": true
    }
  }
]);
Bundles.attachSchema( ExtendedBundleSchema );
```



===============================
#### Utilities  

If you're working with HL7 FHIR Resources, we recommend using [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en).




===============================
#### Licensing  

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
