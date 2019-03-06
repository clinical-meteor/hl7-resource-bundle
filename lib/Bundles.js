if(Package['autopublish']){
  console.log("*****************************************************************************")
  console.log("Your application has the 'autopublish' package installed.  Please uninstall.");
  console.log("");  
  console.log("meteor remove autopublish");  
  console.log("");  
}
import { BaseModel } from 'meteor/clinical:base-model';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { BaseSchema, DomainResourceSchema, HumanNameSchema, IdentifierSchema, ContactPointSchema, AddressSchema, ReferenceSchema, SignatureSchema } from 'meteor/clinical:hl7-resource-datatypes';


// create the object using our BaseModel
Bundle = BaseModel.extend();

//Assign a collection so the object knows how to perform CRUD operations
Bundle.prototype._collection = Bundles;


if(typeof Bundles === 'undefined'){
  if(Package['autopublish']){
    Bundles = new Mongo.Collection('Bundles');
  } else if(Package['clinical:autopublish']){
    Bundles = new Mongo.Collection('Bundles');
  } else if(Package['clinical:desktop-publish']){
    Bundles = new Mongo.Collection('Bundles');
  } else {
    Bundles = new Mongo.Collection('Bundles', {connection: null});
  }
}

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

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
Bundles._transform = function (document) {
  return new Bundle(document);
};

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
  "link" : {
    optional: true,
    type: Array
  },
  "link.$" : {
    optional: true,
    type: Object
  },
  "link.$.relation" : {
    optional: true,
    type: String
  },
  "link.$.url" : {
    optional: true,
    type: String
  },

  "entry" : {
    optional: true,
    type: Array
  },
  "entry.$" : {
    optional: true,
    type: Object
  },

  "entry.$.link" : {
    optional: true,
    type: Array
  },
  "entry.$.link.$" : {
    optional: true,
    type: String 
  },  
  "entry.$.fullUrl" : {
    optional: true,
    type: String
  },
  "entry.$.resource" : {
    optional: true,
    type: Object,
    blackbox: true
  },

  "entry.$.search" : {
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

  "entry.$.request" : {
    optional: true,
    type: Object
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
  "entry.$.response" : {
    optional: true,
    type: Object
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

// BaseSchema.extend(BundleSchema);
// DomainResourceSchema.extend(BundleSchema);
Bundles.attachSchema(BundleSchema);



export { Bundle, Bundles, BundleSchema };