
// create the object using our BaseModel
Bundle = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
Bundle.prototype._collection = Bundles;

// Create a persistent data store for addresses to be stored.
// HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');
Bundles = new Mongo.Collection('Bundles');

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
Bundles._transform = function (document) {
  return new Bundle(document);
};


if (Meteor.isClient){
  Meteor.subscribe("Bundles");
}

if (Meteor.isServer){
  Meteor.publish("Bundles", function (argument){
    if (this.userId) {
      return Bundles.find();
    } else {
      return [];
    }
  });
}



BundleSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "Bundle"
  },
  "type" : {
    optional: true,
    type: Code,
    allowedValues: [  'document' , 'message' , 'transaction' , 'transaction-response' , 'batch' , 'batch-response' , 'history' , 'searchset' , 'collection' ],
    defaultValue: 'searchset'
  },
  "total" : {
    optional: true,
    type: Number
  },
  "link.$.relation" : {
    optional: true,
    type: String
  },
  "link.$.url" : {
    optional: true,
    type: String
  },
  "entry.$.link" : {
    optional: true,
    type: [ String ]
  },
  "entry.$.fullUrl" : {
    optional: true,
    type: String
  },
  "entry.$.resource" : {
    optional: true,
    type: Object
  },
  "entry.$.search.mode" : {
    optional: true,
    type: String
  },
  "entry.$.search.score" : {
    optional: true,
    type: Number
  },
  "entry.$.request.method" : {
    optional: true,
    type: String
  },
  "entry.$.request.url" : {
    optional: true,
    type: String
  },
  "entry.$.request.ifNoneMatch" : {
    optional: true,
    type: String
  },
  "entry.$.request.ifModifiedSince" : {
    optional: true,
    type: Date
  },
  "entry.$.request.ifMatch" : {
    optional: true,
    type: String
  },
  "entry.$.request.ifNoneExist" : {
    optional: true,
    type: String
  },
  "entry.$.response.status" : {
    optional: true,
    type: String
  },
  "entry.$.response.location" : {
    optional: true,
    type: String
  },
  "entry.$.response.etag" : {
    optional: true,
    type: String
  },
  "entry.$.response.lastModified" : {
    optional: true,
    type: Date
  },
  "signature" : {
    optional: true,
    type: SignatureSchema
  }
});

Bundles.attachSchema(BundleSchema);


Bundle.generate = function(data, type){
  var bundle = {
    resourceType: "Bundle",
    type: 'searchset',
    entry: []
  };

  if (type) {
    bundle.type = type;
  }

  // we may want to check whether the data is an array or object
  // and whether we need to push the object into the array
  // for now, we're assuming the data is coming in as an array
  if (data) {
    data.forEach(function(resource){
      var resourceUrl = Meteor.absoluteUrl() + 'fhir/' + resource.resourceType + "/" + resource._id;

      resource.id = resource._id;

      //delete resource.resourceType;
      delete resource._document;
      delete resource._id;

      bundle.entry.push({
        fullUrl: resourceUrl,
        resource: resource
      });
    });

    bundle.total = data.length;
  }

  return bundle;
};
