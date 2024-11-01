import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useTranslation } from 'react-i18next';
import { changeCurrentLanguage, getCurrentLanguage, Language } from '~/app/app.i18n';
import CustomButton from '~/app/components/common/CustomButton';
import logo from '~/assets/images/newLogo.svg';
import './header.css';

export default function Header() {
  const [t] = useTranslation();

  const onChangeLanguage = (lng: string) => {
    switch (lng) {
      case 'en':
        changeCurrentLanguage(Language.English);
        break;
      case 'ch':
        changeCurrentLanguage(Language.Chinese);
        break;
      case 'ru':
        changeCurrentLanguage(Language.Russian);
        break;
      case 'de':
        changeCurrentLanguage(Language.Germany);
        break;
      case 'fr':
        changeCurrentLanguage(Language.French);
        break;
      case 'es':
        changeCurrentLanguage(Language.Spanish);
        break;
      default:
        changeCurrentLanguage(Language.English);
    }
  };

  const handleLaunchFinance = () => {
    window.open('https://app.sloth.finance', '_blank');
  };

  return (
    <Navbar className="header" expand="lg">
      <Navbar.Brand href="/">
        <img src={logo} className="header__logo" alt="logo" />
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="header__right justify-content-end">
        <a href="https://callisto.network/cross-chain-bridges-security-model/" target="_blank" rel="noreferrer">
          {t('SOY Bridge Security Model')}
        </a>
        <CustomButton onClick={handleLaunchFinance}>{t('Launch SOY Finance')}</CustomButton>
        <NavDropdown
          className="header__dropdownToggle"
          title={getCurrentLanguage()}
          as={ButtonGroup}
          id="navbarScrollingDropdown"
        >
          <NavDropdown.Item onClick={() => onChangeLanguage('en')}>EN</NavDropdown.Item>
          <NavDropdown.Item onClick={() => onChangeLanguage('ch')}>CH</NavDropdown.Item>
          <NavDropdown.Item onClick={() => onChangeLanguage('ru')}>RU</NavDropdown.Item>
          <NavDropdown.Item onClick={() => onChangeLanguage('de')}>DE</NavDropdown.Item>
          <NavDropdown.Item onClick={() => onChangeLanguage('fr')}>FR</NavDropdown.Item>
          <NavDropdown.Item onClick={() => onChangeLanguage('es')}>ES</NavDropdown.Item>
        </NavDropdown>
      </Navbar.Collapse>
    </Navbar>
  );
}
