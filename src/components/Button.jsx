import classNames from 'classnames';
import { h } from 'preact';
import PropTypes from 'prop-types';

import styles from 'src/styles/button.module.scss';
import inputStyles from 'src/styles/input.module.scss';

export const Button = ({ buttonText, onClick, disabled }) => (
  <div className={classNames({ [inputStyles.inputGroup]: true, [styles.buttonContainer]: true })}>
    <button
      disabled={disabled}
      className={styles.button}
      onClick={onClick}
    >
      {buttonText}
    </button>
  </div>
);

Button.propTypes = {
  buttonText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

Button.defaultProps = {
  disabled: false
};
