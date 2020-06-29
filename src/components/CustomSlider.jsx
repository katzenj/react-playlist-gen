import { h } from 'preact';

import { Slider } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";

import styles from 'src/styles/slider.module.scss';

const PrettySlider = withStyles({
  root: {
    color: "#0fa3b1",
    height: 8,
    width: '150px',
  },
  thumb: {
    width: 18,
    height: 18,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -6,
    marginLeft: -6,
  },
  valueLabel: {
    left: "calc(-50% - 2px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

export const CustomSlider = ({ label, setValue }) => {
  return (
    <div className={styles.sliderContainer}>
      <PrettySlider 
        max={10} 
        step={0.1} 
        defaultValue={5} 
        valueLabelDisplay="auto" 
        onChange={(_, value) => {
          setValue(value)
        }}
      />
      <h3 className={styles.sliderHeader}>{label}</h3>
    </div>
  );
};
