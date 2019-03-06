import { CardText, CardTitle, Tab, Tabs } from 'material-ui';
import { Glass, GlassCard, VerticalCanvas, FullPageCanvas } from 'meteor/clinical:glass-ui';

import BundleDetail from './BundleDetail';
import BundleTable from './BundleTable';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import PropTypes from 'prop-types';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import { Bundles, BundleSchema } from '../lib/Bundles.js';
import { Grid, Col, Row } from 'react-bootstrap';

let defaultBundle = {
  index: 2,
  id: '',
  username: '',
  email: '',
  given: '',
  family: '',
  gender: ''
};
Session.setDefault('bundleFormData', defaultBundle);
Session.setDefault('bundleSearchFilter', '');
Session.setDefault('selectedBundleId', false);
Session.setDefault('fhirVersion', 'v1.0.2');

export class BundlesPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('bundlePageTabIndex'),
      bundleSearchFilter: Session.get('bundleSearchFilter'),
      fhirVersion: Session.get('fhirVersion'),
      selectedBundleId: Session.get("selectedBundleId"),
      selectedBundle: false
    };

    
    if (Session.get('selectedBundleId')){
      data.selectedBundle = Bundles.findOne({_id: Session.get('selectedBundleId')});
    } else {
      data.selectedBundle = false;
    }


    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    if(process.env.NODE_ENV === "test") console.log("BundlesPage[data]", data);
    return data;
  }

  handleTabChange(index){
    Session.set('bundlePageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedBundleId', false);
    Session.set('bundleUpsert', false);
  }


  render() {
    console.log('React.version: ' + React.version);
    return (
      <div id="bundlesPage">
        <FullPageCanvas>
          <Col md={6}>
            <GlassCard height="auto">
              <CardTitle
                title="Bundles"
              />
              <CardText>
                <BundleTable 
                  showBarcodes={true} 
                  showAvatars={true} 
                  noDataMessagePadding={100}
                  />
              </CardText>
            </GlassCard>
          </Col>
          <Col md={6}>
            <GlassCard height="auto">
              {/* <CardTitle
                title="Bundles"
              /> */}
              <CardText>
                <BundleDetail 
                  id='bundleDetails' 
                  fhirVersion={ this.data.fhirVersion }
                  bundle={ this.data.selectedBundle }
                  bundleId={ this.data.selectedBundleId }
                />
              </CardText>
            </GlassCard>

          </Col>
        </FullPageCanvas>
      </div>
    );
  }
}



ReactMixin(BundlesPage.prototype, ReactMeteorData);
export default BundlesPage;