import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import Image from '~/Components/Image';

import SettingsSection from '~/Components/SettingsSection';
import InputWithLabel from '~/Components/InputWithLabel';
import SettingsPanelFooter from '~/Components/SettingsPanelFooter';
import LinkPanel from '../../../../Components/LinkPanel.jsx';
import FileInput from '~/Components/FileInput';
import { mergeStyles } from '~/Utils';
import styles from './gallery-image-settings.scss';
import GallerySettingsMobileHeader from './gallery-settings-mobile-header';

class ImageSettings extends Component {

  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
    this.state = this.propsToState(this.props);
  }

  propsToState(props) {
    return {
      selectedIndex: props.selectedImage ?
        findIndex(props.images, i => props.selectedImage.url === i.url) : -1,
      images: props.images
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState(this.propsToState(nextProps));
    }
  }

  componentDidMount() {
    this.initialImageState = this.props.images.map(i => ({ ...i }));
  }

  setLinkPanel = linkPanel => this.linkPanel = linkPanel;

  deleteImage(selectedImage) {
    const images = this.state.images.filter(i => i.url !== selectedImage.url);
    this.setState({
      images,
      selectedIndex: Math.min(this.state.selectedIndex, images.length - 1)
    });
  }

  imageMetadataUpdated = (image, value) => {
    image.metadata = Object.assign({}, image.metadata, value);
    this.setState({ images: this.state.images });
  };

  replaceItem(event) {
    const { handleFileChange } = this.props;
    const itemIdx = this.state.selectedIndex;
    handleFileChange(event, itemIdx);
  }

  onDoneClick = selectedImage => {
    const { onSave } = this.props;
    if (this.linkPanel.state.isValidUrl && this.linkPanel.state.url) {
      const { url, targetBlank, nofollow } = this.linkPanel.state;
      this.imageMetadataUpdated(selectedImage, { link: { url, targetBlank, nofollow } });
    }
    onSave(this.state.images);
  }

  render() {
    const styles = this.styles;
    const { onCancel, theme, isMobile } = this.props;
    const { images } = this.state;
    const selectedImage = images[this.state.selectedIndex];
    const { url, targetBlank, nofollow } = (!isEmpty(selectedImage.metadata.link) ? selectedImage.metadata.link : {});

    return (
      <div className={styles.imageSettings}>
        <div className={styles.imageSettings_content}>
          { isMobile ?
            <GallerySettingsMobileHeader
              theme={theme}
              cancel={() => onCancel(this.initialImageState)}
              save={() => this.onDoneClick(selectedImage)}
              saveName="Update"
            /> :
            <h3
              className={classNames(styles.imageSettings_backButton, styles.imageSettings_title)}
              onClick={() => onCancel(this.initialImageState)}
            >← Image Settings
            </h3>
          }
          <div className={classNames(styles.imageSettings_scrollContainer, { [styles.mobile]: isMobile })}>
            <SettingsSection theme={theme}>
              <Image
                resizeMode={'contain'}
                className={styles.imageSettings_image}
                src={`https://static.wixstatic.com/${selectedImage.url}`}
                theme={theme}
              />
              <div className={classNames(styles.imageSettings_nav, { [styles.mobile]: isMobile })}>
                <i
                  className={classNames(styles.imageSettings_previous, this.state.selectedIndex === 0 ? styles.imageSettings_hidden : '')}
                  onClick={() => this.setState({ selectedIndex: this.state.selectedIndex - 1 })}
                />
                <i
                  className={classNames(styles.imageSettings_next, this.state.selectedIndex === images.length - 1 ? styles.imageSettings_hidden : '')}
                  onClick={() => this.setState({ selectedIndex: this.state.selectedIndex + 1 })}
                />
              </div>
            </SettingsSection>
            <div className={styles.imageSettings_manageImageGrid}>
              <FileInput className={styles.imageSettings_replace} onChange={this.replaceItem.bind(this)}>
                <span className={styles.imageSettings_replace_text}>{'Replace'}</span>
              </FileInput>
              <button className={styles.imageSettings_delete} onClick={() => this.deleteImage(selectedImage)}>
                <span className={styles.imageSettings_delete_text}>{'Delete'}</span>
              </button>
            </div>
            <SettingsSection theme={theme} className={styles.imageSettings_section}>
              <InputWithLabel
                theme={theme}
                label={'Title'}
                placeholder={'Add image title'}
                value={selectedImage.metadata.title || ''}
                onChange={event => this.imageMetadataUpdated(selectedImage, { title: event.target.value })}
              />
            </SettingsSection>
            <SettingsSection theme={theme} className={styles.imageSettings_section}>
              <InputWithLabel
                theme={theme}
                label={'Description'}
                placeholder={'Describe your image'}
                value={selectedImage.metadata.description || ''}
                onChange={event => this.imageMetadataUpdated(selectedImage, { description: event.target.value })}
              />
            </SettingsSection>
            <SettingsSection theme={theme} className={this.styles.imageSettings_section}>
              <label className={this.styles.inputWithLabel_label}>Link</label>
            </SettingsSection>
            <div className={this.styles.imageSettingsLinkContainer}>
              <LinkPanel
                ref={this.setLinkPanel}
                theme={theme}
                url={url}
                targetBlank={targetBlank}
                nofollow={nofollow}
                isImageSettings
              />
            </div>
          </div>
          {isMobile ? null : <SettingsPanelFooter
            theme={theme}
            className={styles.imageSettings_footer}
            cancel={() => onCancel(this.initialImageState)}
            save={() => this.onDoneClick(selectedImage)}
          />
          }
        </div>
      </div>
    );
  }
}

ImageSettings.propTypes = {
  selectedImage: PropTypes.any.isRequired,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  isMobile: PropTypes.bool
};

export default ImageSettings;
