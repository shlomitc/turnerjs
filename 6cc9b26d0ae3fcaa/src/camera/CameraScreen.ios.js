import React, {Component, PropTypes} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import {connect} from 'react-redux';

import _ from 'lodash';
import * as imagesActions from '../images/actions';
import * as Constants from '../images/constants';

import {CameraKitCamera} from 'react-native-camera-kit';
import {i18n} from './../../strings';

const FLASH_MODE_AUTO = 'auto';
const FLASH_MODE_ON = 'on';
const FLASH_MODE_OFF = 'off';

const OVERLAY_DEFAULT_COLOR = '#00000077';

const flashAutoImage = require('./../../images/flashAuto.png');
const flashOnImage = require('./../../images/flashOn.png');
const flashOffImage = require('./../../images/flashOff.png');
const flashArray = [
  {
    mode: FLASH_MODE_AUTO,
    image: flashAutoImage
  },
  {
    mode: FLASH_MODE_ON,
    image: flashOnImage
  },
  {
    mode: FLASH_MODE_OFF,
    image: flashOffImage
  }
];

const BUTTON_TYPE_CANCEL = 'cameraScreen.buttonType.cancel';
const BUTTON_TYPE_DONE = 'cameraScreen.buttonType.done';

class CameraScreen extends Component {

  static propTypes = {
    cameraRatioOverlay: PropTypes.object,
    cameraOptions: PropTypes.object,
    captureImages: PropTypes.any,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.currentFlashArrayPosition = 0;
    this.state = {
      images: [],
      flashData: flashArray[this.currentFlashArrayPosition],
      canCaptureImage: true,
      ratios: [],
      cameraOptions: {},
      ratioArrayPosition: -1,
      captured: false,
      singleImageMode: (this.props.maxImagesUpload === 1)
    };
    this.onSetFlash = this.onSetFlash.bind(this);
    this.onSwitchCameraPressed = this.onSwitchCameraPressed.bind(this);
    this.onBottomButtonPressed = this.onBottomButtonPressed.bind(this);
  }

  componentDidMount() {
    const cameraOptions = this.getCameraOptions();
    let ratios = [];
    if (this.props.cameraRatioOverlay) {
      ratios = this.props.cameraRatioOverlay.ratios || [];
    }
    this.setState({
      cameraOptions,
      ratios: (ratios || []),
      ratioArrayPosition: ((ratios.length > 0) ? 0 : -1)
    });
  }

  getCameraOptions() {
    const cameraOptions = {
      flashMode: 'auto',
      focusMode: 'on',
      zoomMode: 'on'
    };
    if (this.props.cameraRatioOverlay) {
      const overlay = this.props.cameraRatioOverlay;
      cameraOptions.ratioOverlayColor = overlay.color || OVERLAY_DEFAULT_COLOR;

      if (overlay.ratios && overlay.ratios.length > 0) {
        cameraOptions.ratioOverlay = overlay.ratios[0];
      }
    }

    return cameraOptions;
  }

  renderFlashButton() {
    return (
      <TouchableOpacity style={{paddingHorizontal: 15}} onPress={() => this.onSetFlash(FLASH_MODE_AUTO)}>
        <Image
          style={{flex: 1, justifyContent: 'center'}}
          source={this.state.flashData.image}
          resizeMode={Image.resizeMode.contain}
        />
      </TouchableOpacity>
    );
  }

  renderSwitchCameraButton() {
    return (
      <TouchableOpacity style={{paddingHorizontal: 15}} onPress={this.onSwitchCameraPressed}>
        <Image
          style={{flex: 1, justifyContent: 'center'}}
          source={require('./../../images/cameraFlipIcon.png')}
          resizeMode={Image.resizeMode.contain}
        />
      </TouchableOpacity>
    );
  }

  renderTopButtons() {
    return (
      <View style={styles.topButtons}>
        {this.renderFlashButton()}
        {this.renderSwitchCameraButton()}
      </View>
    );
  }

  renderCamera() {
    return (
      <View style={styles.cameraContainer}>
        <CameraKitCamera
          ref={(cam) => this.camera = cam}
          style={{flex: 1, justifyContent: 'flex-end'}}
          cameraOptions={this.state.cameraOptions}
        />
      </View>
    );
  }

  renderCancelButton() {
    return (
      <TouchableOpacity
        style={{flex: 1, justifyContent: 'center', padding: 10}}
        onPress={() => this.onBottomButtonPressed(BUTTON_TYPE_CANCEL)}
      >
        <Text style={styles.textStyle}>{i18n('CAMERA_SCREEN_CANCEL_BUTTON')}</Text>
      </TouchableOpacity>
    );
  }

  renderCaptureButton() {
    return (
      <View style={styles.captureButtonContainer}>
        <TouchableOpacity
          disabled={!this.state.canCaptureImage}
          onPress={() => this.onCaptureImagePressed()}
        >
          <Image
            style={styles.captureButton}
            source={require('./../../images/cameraButton.png')}
            resizeMode={'contain'}
          >
            <Text style={styles.captureNumber}>
              {this.numberOfImagesTaken()}
            </Text>
          </Image>
        </TouchableOpacity>
      </View>
    );
  }

  renderDoneButton() {
    if (this.state.captured) {
      return (
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => this.onBottomButtonPressed(BUTTON_TYPE_DONE)}
        >
          <Text style={styles.textStyle}>{i18n('CAMERA_SCREEN_DONE_BUTTON')}</Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.doneButton}
        />
      );
    }
  }

  renderRatioStrip() {
    if (this.state.ratios.length === 0) {
      return null;
    }
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end'}}>
        <View style={{flexDirection: 'row', alignItems: 'center', paddingRight: 10, paddingLeft: 20}}>
          <TouchableOpacity
            style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 8}}
            onPress={() => this.onRatioButtonPressed()}
          >
            <Text style={styles.ratioText}>{this.state.cameraOptions.ratioOverlay}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderBottomButtons() {
    return (
      <View style={styles.bottomButtons}>
        {this.renderCancelButton()}
        {this.renderCaptureButton()}
        {this.renderDoneButton()}
      </View>
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'black'}}>
        {this.renderTopButtons()}
        {this.renderCamera()}
        {this.renderRatioStrip()}
        {this.renderBottomButtons()}
      </View>
    );
  }

  numberOfImagesTaken() {
    const numberTook = this.props.captureImages.length;
    if (numberTook >= 2) {
      return numberTook;
    } else if (this.state.captured) {
      return '1';
    } else {
      return '';
    }
  }

  async onBottomButtonPressed(buttonType) {
    if (this.state.canCaptureImage) {
      if (buttonType === BUTTON_TYPE_DONE) {
        this.props.dispatch(imagesActions.cameraDoneUpdateValue(Constants.CAMERA_SCREEN_STATE_DONE_PRESSED));
      } else if (buttonType === BUTTON_TYPE_CANCEL) {
        this.props.dispatch(imagesActions.cleanCaptureImages());
        this.props.dispatch(imagesActions.cameraDoneUpdateValue(Constants.CAMERA_SCREEN_STATE_CANCEL_PRESSED));
      }
    }
  }

  onSwitchCameraPressed() {
    this.camera.changeCamera();
  }

  async onSetFlash() {
    this.currentFlashArrayPosition = (this.currentFlashArrayPosition + 1) % 3;
    const newFlashData = flashArray[this.currentFlashArrayPosition];
    this.setState({flashData: newFlashData});
    this.camera.setFlashMode(newFlashData.mode);
  }

  async onCaptureImagePressed() {
    if (this.state.canCaptureImage) {
      this.setState({...this.state, canCaptureImage: false, captured: true});
      const image = await this.camera.capture(true);

      if (image) {
        const isImageExist = _.find(this.state.images, (img) => img.id === image.id);

        if (!isImageExist) {
          this.setState({images: this.state.images.concat([image])});
          await this.props.dispatch(imagesActions.imageCapture(image.id));

        }
      }
      this.setState({canCaptureImage: true});
      if (this.state.singleImageMode) {
        this.onBottomButtonPressed(BUTTON_TYPE_DONE);
      }
    }
  }

  onRatioButtonPressed() {
    const newRatiosArrayPosition = ((this.state.ratioArrayPosition + 1) % this.state.ratios.length);
    const newCameraOptions = _.update(this.state.cameraOptions, 'ratioOverlay', (val) => this.state.ratios[newRatiosArrayPosition]);
    this.setState({ratioArrayPosition: newRatiosArrayPosition, cameraOptions: newCameraOptions});

  }
}

const styles = StyleSheet.create({
  textStyle: {
    color: 'white',
    fontSize: 20
  },
  ratioBestText: {
    color: 'white',
    fontSize: 18,
  },
  ratioText: {
    color: '#ffc233',
    fontSize: 18
  },
  topButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 0
  },
  cameraContainer: {
    flex: 10,
    flexDirection: 'column'
  },
  bottomButtons: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14
  },
  doneButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10
  },
  captureButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  captureNumber: {
    justifyContent: 'center',
    color: 'black',
    backgroundColor: 'transparent'
  }
});

function mapStateToProps(state) {
  return {
    ...state.images
  };
}

export default connect(mapStateToProps)(CameraScreen);
