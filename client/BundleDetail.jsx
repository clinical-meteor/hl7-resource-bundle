import { CardActions, CardText, DatePicker, Toggle, RaisedButton, TextField } from 'material-ui';
import { get, has, set } from 'lodash';
import { Row, Col } from 'react-bootstrap';
import moment from 'moment';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';


const styles = {
  block: {
    maxWidth: 250,
  },
  toggle: {
    marginTop: 16,
  },
  thumbOff: {
    backgroundColor: '#ffcccc',
  },
  trackOff: {
    backgroundColor: '#ff9d9d',
  },
  thumbSwitched: {
    backgroundColor: 'red',
  },
  trackSwitched: {
    backgroundColor: '#ff9d9d',
  },
  labelStyle: {
    color: 'red',
  },
};

export class BundleDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bundleId: false,
      bundle: {
        resourceType : 'Bundle',
        name : [{
          text : '',
          prefix: [''],
          family: [''],
          given: [''],
          suffix: [''],
          resourceType : 'HumanName'
        }],
        active : true,
        gender : "",
        birthDate : '',
        photo : [{
          url: ""
        }],
        identifier: [{
          use: 'usual',
          type: {
            coding: [
              {
                system: 'http://hl7.org/fhir/v2/0203',
                code: 'MR'
              }
            ]
          },
          value: ''
        }],
        deceasedBoolean: false,
        multipleBirthBoolean: false,
        maritalStatus: {
          text: ''
        },
        contact: [],
        animal: {
          species: {
            text: 'Human'
          }
        },
        communication: [{
          language: {
            text: 'English'
          }
        }],
        careProvider: [{
          display: '',
          reference: ''
        }],
        managingOrganization: {
          reference: '',
          display: ''
        }
      },
      form: {
        prefix: '',
        family: '',
        given: '',
        suffix: '',
        identifier: '',
        deceased: false,
        multipleBirth: false,
        maritalStatus: '',
        species: '',
        language: ''
      }
    }
  }
  dehydrateFhirResource(bundle) {
    let formData = Object.assign({}, this.state.form);

    formData.prefix = get(bundle, 'name[0].prefix[0]')
    formData.family = get(bundle, 'name[0].family[0]')
    formData.given = get(bundle, 'name[0].given[0]')
    formData.suffix = get(bundle, 'name[0].suffix[0]')
    formData.identifier = get(bundle, 'identifier[0].value')
    formData.deceased = get(bundle, 'deceasedBoolean')
    formData.gender = get(bundle, 'gender')
    formData.multipleBirth = get(bundle, 'multipleBirthBoolean')
    formData.maritalStatus = get(bundle, 'maritalStatus.text')
    formData.species = get(bundle, 'animal.species.text')
    formData.language = get(bundle, 'communication[0].language.text')
    formData.birthDate = moment(bundle.birthDate).format("YYYY-MM-DD")

    return formData;
  }
  shouldComponentUpdate(nextProps){
    process.env.NODE_ENV === "test" && console.log('BundleDetail.shouldComponentUpdate()', nextProps, this.state)
    let shouldUpdate = true;

    // both false; don't take any more updates
    if(nextProps.bundle === this.state.bundle){
      shouldUpdate = false;
    }

    // received an bundle from the table; okay lets update again
    if(nextProps.bundleId !== this.state.bundleId){
      this.setState({bundleId: nextProps.bundleId})
      
      if(nextProps.bundle){
        this.setState({bundle: nextProps.bundle})     
        this.setState({form: this.dehydrateFhirResource(nextProps.bundle)})       
      }
      shouldUpdate = true;
    }
 
    return shouldUpdate;
  }
  getMeteorData() {
    let data = {
      bundleId: this.props.bundleId,
      bundle: false,
      form: this.state.form
    };

    if(this.props.bundle){
      data.bundle = this.props.bundle;
    }
    if(this.props.displayBirthdate){
      data.displayBirthdate = this.props.displayBirthdate;
    }

    if(process.env.NODE_ENV === "test") console.log("BundleDetail[data]", data);
    return data;
  }

  render() {
    if(process.env.NODE_ENV === "test") console.log('BundleDetail.render()', this.state)
    let formData = this.state.form;

    return (
      <div id={this.props.id} className="bundleDetail">
        <CardText>
          <Row>
            <Col md={4}>
              <TextField
                id='mrnInput'
                ref='identifier'
                name='identifier'
                floatingLabelText='Identifier (Medical Record Number)'
                value={ get(formData, 'identifier', '')}
                onChange={ this.changeState.bind(this, 'identifier')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3} mdOffset={5}>
              <br />
              <Toggle
                label="Deceased"
                labelPosition="right"
                defaultToggled={false}
                style={styles.toggle}
              />
            </Col>
          </Row>
          <Row>
            <Col md={1}>
              <TextField
                id='prefixInput'
                ref='prefix'
                name='prefix'
                floatingLabelText='Prefix'
                value={ get(formData, 'prefix', '')}
                onChange={ this.changeState.bind(this, 'prefix')}
                hintText=''
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={5}>
              <TextField
                id='givenInput'
                ref='given'
                name='given'
                floatingLabelText='Given Name'
                hintText='Jane'
                value={ get(formData, 'given', '')}
                onChange={ this.changeState.bind(this, 'given')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='familyInput'
                ref='family'
                name='family'
                floatingLabelText='Family Name'
                hintText='Doe'
                value={ get(formData, 'family', '')}
                onChange={ this.changeState.bind(this, 'family')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>

            </Col>
            <Col md={3}>
              <TextField
                id='suffixInput'
                ref='suffix'
                name='suffix'
                floatingLabelText='Suffix / Maiden'
                hintText=''
                value={ get(formData, 'suffix', '')}
                onChange={ this.changeState.bind(this, 'suffix')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <TextField
                id='maritalStatusInput'
                ref='maritalStatus'
                name='maritalStatus'
                floatingLabelText='Marital Status'
                hintText='single | maried | other'
                value={ get(formData, 'maritalStatus', '')}
                onChange={ this.changeState.bind(this, 'maritalStatus')}
                floatingLabelFixed={false}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='genderInput'
                ref='gender'
                name='gender'
                floatingLabelText='Gender'
                hintText='male | female | unknown'
                value={ get(formData, 'gender', '')}
                onChange={ this.changeState.bind(this, 'gender')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              {/* <br />
              { this.renderDatePicker(true, get(formData, 'birthDate') ) } */}

              <TextField
                id='birthDateInput'
                ref='birthDate'
                name='birthDate'
                type='date'
                floatingLabelText='Birthdate'
                // hintText='YYYY-MM-DD'
                value={ get(formData, 'birthDate', '')}
                onChange={ this.changeState.bind(this, 'birthDate')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3} >
              <br />
              <Toggle
                label="Multiple Birth"
                defaultToggled={false}
                labelPosition="right"
                style={styles.toggle}
              />              
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <TextField
                id='photoInput'
                ref='photo'
                name='photo'
                floatingLabelText='Photo'
                hintText='http://somewhere.com/image.jpg'
                value={ get(formData, 'photo', '')}
                onChange={ this.changeState.bind(this, 'photo')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='speciesInput'
                ref='species'
                name='species'
                floatingLabelText='Species'
                value={ get(formData, 'species', '')}
                hintText='Human'
                onChange={ this.changeState.bind(this, 'species')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='languageInput'
                ref='language'
                name='language'
                floatingLabelText='Language'
                value={ get(formData, 'language', '')}
                onChange={ this.changeState.bind(this, 'language')}
                hintText='English'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
          </Row>


        </CardText>
        <CardActions>
          { this.determineButtons(this.data.bundleId) }
        </CardActions>
      </div>
    );
  }
  renderDatePicker(displayDatePicker, birthDate){
    if (displayDatePicker) {
      console.log('renderDatePicker', displayDatePicker, birthDate, typeof birthDate)

      let javascriptDate;
      let momentDate;

      if(typeof birthDate === "string"){
        momentDate = moment(birthDate).toDate();
      } else {
        momentDate = birthDate;
      }
    
      console.log('javascriptDate', javascriptDate)
      console.log('momentDate', momentDate)

      return (
        <DatePicker 
          name='birthDate'
          hintText="Birthdate" 
          container="inline" 
          mode="landscape"
          value={ momentDate ? momentDate : null}    
          onChange={ this.changeState.bind(this, 'birthDate')}      
          floatingLabelFixed={true}
          fullWidth
        />
      );
    }
  }
  determineButtons(bundleId){
    if (bundleId) {
      return (
        <div>
          <RaisedButton id='updateBundleButton' className='updateBundleButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}} />
          <RaisedButton id='deleteBundleButton' label="Delete" onClick={this.handleDeleteButton.bind(this)} />
        </div>
      );
    } else {
      return(
        <RaisedButton id='saveBundleButton'  className='saveBundleButton' label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }

  updateFormData(formData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("BundleDetail.updateFormData", formData, field, textValue);

    switch (field) {
      case "prefix":
        set(formData, 'prefix', textValue)
        break;
      case "family":
        set(formData, 'family', textValue)
        break;
      case "given":
        set(formData, 'given', textValue)
        break;        
      case "suffix":
        set(formData, 'suffix', textValue)
        break;
      case "identifier":
        set(formData, 'identifier', textValue)
        break;
      case "gender":
        set(formData, 'gender', textValue)
        break;
      case "maritalStatus":
        set(formData, 'maritalStatus', textValue)
        break;
      case "deceased":
        set(formData, 'deceased', textValue)
        break;
      case "multipleBirth":
        set(formData, 'multipleBirth', textValue)
        break;
      case "species":
        set(formData, 'species', textValue)
        break;
      case "language":
        set(formData, 'language', textValue)
        break;
      case "photo":
        set(formData, 'photo', textValue)
        break;
      case "birthDate":
        set(formData, 'birthDate', textValue)
        break;
      default:
    }

    if(process.env.NODE_ENV === "test") console.log("formData", formData);
    return formData;
  }
  updateBundle(bundleData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("BundleDetail.updateBundle", bundleData, field, textValue);

    switch (field) {
      case "prefix":
        set(bundleData, 'name[0].prefix[0]', textValue)
        break;
      case "family":
        set(bundleData, 'name[0].family[0]', textValue)
        break;
      case "given":
        set(bundleData, 'name[0].given[0]', textValue)
        break;        
      case "suffix":
        set(bundleData, 'name[0].suffix[0]', textValue)
        break;
      case "identifier":
        set(bundleData, 'identifier[0].value', textValue)
        break;
      case "deceased":
        set(bundleData, 'deceasedBoolean', textValue)
        break;
      case "multipleBirth":
        set(bundleData, 'multipleBirthBoolean', textValue)
        break;
      case "gender":
        set(bundleData, 'gender', textValue)
        break;
      case "maritalStatus":
        set(bundleData, 'maritalStatus.text', textValue)
        break;
      case "species":
        set(bundleData, 'animal.species.text', textValue)
        break;
      case "language":
        set(bundleData, 'communication[0].language.text', textValue)
        break;  
      case "photo":
        set(bundleData, 'photo[0].url', textValue)
        break;
      case "birthDate":
        set(bundleData, 'birthDate', textValue)
        break;
    }
    return bundleData;
  }
  changeState(field, event, textValue){
    if(process.env.NODE_ENV === "test") console.log("   ");
    if(process.env.NODE_ENV === "test") console.log("BundleDetail.changeState", field, textValue);
    if(process.env.NODE_ENV === "test") console.log("this.state", this.state);

    let formData = Object.assign({}, this.state.form);
    let bundleData = Object.assign({}, this.state.bundle);

    formData = this.updateFormData(formData, field, textValue);
    bundleData = this.updateBundle(bundleData, field, textValue);

    if(process.env.NODE_ENV === "test") console.log("bundleData", bundleData);
    if(process.env.NODE_ENV === "test") console.log("formData", formData);

    this.setState({bundle: bundleData})
    this.setState({form: formData})
  }


  // this could be a mixin
  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new Bundle...', this.state)

    let self = this;
    let fhirBundleData = Object.assign({}, this.state.bundle);

    if(process.env.NODE_ENV === "test") console.log('fhirBundleData', fhirBundleData);


    let bundleValidator = BundleSchema.newContext();
    console.log('bundleValidator', bundleValidator)
    bundleValidator.validate(fhirBundleData)

    console.log('IsValid: ', bundleValidator.isValid())
    // console.log('ValidationErrors: ', bundleValidator.validationErrors());

    if (this.state.bundleId) {
      if(process.env.NODE_ENV === "test") console.log("Updating bundle...");

      delete fhirBundleData._id;

      // not sure why we're having to respecify this; fix for a bug elsewhere
      fhirBundleData.resourceType = 'Bundle';

      Bundles._collection.update({_id: this.state.bundleId}, {$set: fhirBundleData }, function(error, result){
        if (error) {
          if(process.env.NODE_ENV === "test") console.log("Bundles.insert[error]", error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Bundles", recordId: self.state.bundleId});
          Session.set('selectedBundleId', false);
          Session.set('bundlePageTabIndex', 1);
          Bert.alert('Bundle added!', 'success');
        }
      });
    } else {
      if(process.env.NODE_ENV === "test") console.log("Creating a new bundle...", fhirBundleData);

      Bundles._collection.insert(fhirBundleData, function(error, result) {
        if (error) {
          if(process.env.NODE_ENV === "test")  console.log('Bundles.insert[error]', error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Bundles", recordId: self.state.bundleId});
          Session.set('bundlePageTabIndex', 1);
          Session.set('selectedBundleId', false);
          Bert.alert('Bundle added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('bundlePageTabIndex', 1);
  }

  handleDeleteButton(){
    let self = this;
    Bundles._collection.animalremove({_id: this.state.bundleId}, function(error, result){
      if (error) {
        if(process.env.NODE_ENV === "test") console.log('Bundles.insert[error]', error);
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Bundles", recordId: self.state.bundleId});
        Session.set('bundlePageTabIndex', 1);
        Session.set('selectedBundleId', false);
        Bert.alert('Bundle removed!', 'success');
      }
    });
  }
}

BundleDetail.propTypes = {
  id: PropTypes.string,
  fhirVersion: PropTypes.string,
  bundleId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  bundle: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};
ReactMixin(BundleDetail.prototype, ReactMeteorData);
export default BundleDetail;