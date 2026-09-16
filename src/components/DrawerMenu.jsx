import React, { useState } from 'react';
import { withRouter } from '../utils/withRouter';
import PropTypes from 'prop-types';
import { slide as Menu } from 'react-burger-menu';
import { ShoppingCart } from '../utils/shopping-cart';
import { ROUTES } from '../utils/Constants';
import { isProblemUser, isVisualUser, removeCredentials } from '../utils/Credentials';
import menuClosePng from '../assets/img/close.png';
import menuCloseSvg from '../assets/svg/close@3x.svg';
import menuIconPng from '../assets/img/menu.png';
import menuIconSvg from '../assets/svg/menu3x.svg';
import './DrawerMenu.css';

const DrawerMenu = ({ history }) => {
  const [isDynamicCatalogOpen, setIsDynamicCatalogOpen] = useState(false);
  const resetStorage = () => {
    // Wipe out our shopping cart now
    ShoppingCart.resetCart();
  };
  const aboutLink = isProblemUser() ? 'https://saucelabs.com/error/404' : 'https://saucelabs.com/';
  const isVisualFailure = isVisualUser();
  const imageClass = isVisualFailure ? 'visual_failure' : '';

  return (
    <Menu
      customBurgerIcon={
        <img
          src={menuIconPng}
          className={imageClass}
          srcSet={menuIconSvg}
          alt="Open Menu"
          data-testid="open-menu"
        />
      }
      customCrossIcon={
        <img
          src={menuClosePng}
          className={imageClass}
          srcSet={menuCloseSvg}
          alt="Close Menu"
          data-testid="close-menu"
        />
      }
      outerContainerId={'page_wrapper'}
      pageWrapId={'contents_wrapper'}
      noOverlay
      aria-label="Main menu">
      <a
        id="inventory_sidebar_link"
        className="menu-item"
        href="#"
        onClick={(evt) => {
          evt.preventDefault();
          history.push(ROUTES.INVENTORY);
        }}
        data-testid="inventory-sidebar-link"
        role="button">
        All Items
      </a>
      <a
        id="dynamic_catalog_sidebar_link"
        className="menu-item"
        href="#"
        onClick={(evt) => {
          evt.preventDefault();
          setIsDynamicCatalogOpen((open) => !open);
        }}
        data-testid="dynamic-catalog-sidebar-link"
        role="button"
        aria-expanded={isDynamicCatalogOpen}
        aria-controls="dynamic_catalog_submenu">
        Dynamic Catalog
        <span
          className={`submenu-chevron${isDynamicCatalogOpen ? ' open' : ''}`}
          aria-hidden="true"
        />
      </a>
      {isDynamicCatalogOpen && (
        <div id="dynamic_catalog_submenu" data-testid="dynamic-catalog-submenu">
          <a
            id="dynamic_catalog_lazy_load_link"
            className="menu-item submenu-item"
            href="#"
            onClick={(evt) => {
              evt.preventDefault();
              history.push(ROUTES.DYNAMIC_CATALOG_LAZY_LOAD);
            }}
            data-testid="dynamic-catalog-lazy-load-link"
            role="button">
            Lazy Load
          </a>
          <a
            id="dynamic_catalog_spinner_link"
            className="menu-item submenu-item"
            href="#"
            onClick={(evt) => {
              evt.preventDefault();
              history.push(ROUTES.DYNAMIC_CATALOG_SPINNER);
            }}
            data-testid="dynamic-catalog-spinner-link"
            role="button">
            Spinner
          </a>
          <a
            id="dynamic_catalog_slider_link"
            className="menu-item submenu-item"
            href="#"
            onClick={(evt) => {
              evt.preventDefault();
              history.push(ROUTES.DYNAMIC_CATALOG_SLIDER);
            }}
            data-testid="dynamic-catalog-slider-link"
            role="button">
            Slider
          </a>
        </div>
      )}
      <a
        id="about_sidebar_link"
        className="menu-item"
        href={aboutLink}
        data-testid="about-sidebar-link">
        About
      </a>
      <a
        id="logout_sidebar_link"
        className="menu-item"
        href="#"
        onClick={(evt) => {
          evt.preventDefault();
          removeCredentials();
          history.push(ROUTES.LOGIN);
        }}
        data-testid="logout-sidebar-link"
        role="button">
        Logout
      </a>
      <a
        id="reset_sidebar_link"
        className="menu-item"
        href="#"
        onClick={(evt) => {
          evt.preventDefault();
          resetStorage();
        }}
        data-testid="reset-sidebar-link"
        role="button">
        Reset App State
      </a>
    </Menu>
  );
};
DrawerMenu.propTypes = {
  /**
   * The history
   */
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(DrawerMenu);
