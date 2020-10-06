import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setInputValue, addRow } from '../../store/randomObjects';
import classnames from 'classnames';
import './AddForm.scss';

export const AddForm = () => {
  const dispatch = useDispatch();
  const [inputData, setInputData] = useState({
    mValue: '',
    nValue: '',
    xValue: '',
  });
  const [hasError, setHasError] = useState({
    mError: '',
    nError: '',
    xError: '',
  });

  const handleSubmit = event => {
    event.preventDefault();
    const { xValue } = inputData;
    const { mError, nError, xError } = hasError;

    if(mError || nError || xError) {
      return;
    }

    if(xValue === '') {
      setInputData(prev => ({ ...prev, xValue: 0 }));
    }

    dispatch(setInputValue(inputData));
  }

  const handleChange = event => {
    const { id, value } = event.target;
    const { mValue, nValue } = inputData;
    switch(id) {
      case 'mValue':
        if(value <= 0 || value > 20 || isNaN(value)) {
          setHasError(prev => ({ ...prev, mError: true}));
        } else {
          setHasError(prev => ({ ...prev, mError: false }));
        }
        break;
      case 'nValue':
        if(value <= 0 || value > 12 || isNaN(value)) {
          setHasError(prev => ({ ...prev, nError: true}));
        } else {
          setHasError(prev => ({ ...prev, nError: false }));
        }
        break;
      case 'xValue':
        if(value > mValue * nValue - 1 || value < 0 || isNaN(value)) {
          setHasError(prev => ({ ...prev, xError: true }));
        } else {
          setHasError(prev => ({ ...prev, xError: false }));
        }
        break;
      default:
        return;
    }

    setInputData(prevState => ({ ...prevState, [id]: value }));
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="mValue" className="form__label">M:</label>
      <input 
        value={inputData.mValue}
        className={classnames({
          'form__input': true,
          'form__input--error': hasError.mError,
        })}
        id="mValue"
        type="text" 
        placeholder="Enter M value(from 1 to 20)"
        onChange={handleChange}
      />
      <label htmlFor="nValue" className="form__label">N:</label>
      <input 
        value={inputData.nValue}
        className={classnames({
          'form__input': true,
          'form__input--error': hasError.nError,
        })}
        id="nValue"
        type="text" 
        placeholder="Enter N value(from 1 to 12)"
        onChange={handleChange}
      />
      <label htmlFor="xValue" className="form__label">X:</label>
      <input 
        value={inputData.xValue}
        className={classnames({
          'form__input': true,
          'form__input--error': hasError.xError,
        })}
        id="xValue"
        type="text" 
        placeholder="Enter X value"
        onChange={handleChange}
      />
      <button 
        className="form__button"
        type="submit"
      >
        Apply
      </button>
      <button
        className="form__button"
        type="button"
        onClick={() => dispatch(addRow(inputData.nValue))}
      >
        Add row
      </button>
    </form>
  );
}