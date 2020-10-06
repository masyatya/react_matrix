import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addOneObj, 
  deleteRow, 
  findXobjs, 
  resetPercentages, 
  resetXobjs, 
  setPercentages
} from '../../store/randomObjects';
import * as selectors from '../../store';
import './Table.scss';

export const Table = () => {
  const dispatch = useDispatch();
  const objs = useSelector(selectors.getRandomObjects);
  const xValue = useSelector(selectors.getXvalue);
  const highlightObjects = useSelector(selectors.getHighlightObjects);
  const rowPercentages = useSelector(selectors.getRowPercentages);
  const [mRows, setMrows] = useState(null);
  const [footTable, setFootTable] = useState(null);

  const handleAdd = useCallback((id) => {
    dispatch(addOneObj(id));
  }, [dispatch]);

  const handleDelete = useCallback((i) => {
    dispatch(deleteRow(i))
  }, [dispatch]);

  useEffect(() => {
    if(objs.length) {
      let tFoot = [];
      let nColumns = new Array(objs[0].length).fill(0).map(() => new Array(objs.length).fill(0));
      let sum = 0;
      setMrows(objs.map((obj, i) => {
        sum = 0;
        let nColumn;
        if(rowPercentages[0] && rowPercentages[0].id === obj[0].id) {
          nColumn = rowPercentages.map(item => {
            return (
              <td 
                className={`table__item table__item--perc-${Math.round(item.amount*100)}`}
                key={item.id}
              >
                {`${Math.round(item.amount*100)}%`}
              </td>
            )
          });
        }
        else {
          nColumn = obj.map(item => {
            const highlight = highlightObjects.some(o => o.id === item.id);
            return (
              <td 
                onClick={() => handleAdd(item.id)}
                onMouseEnter={() => dispatch(findXobjs(item.amount, item.id, xValue))}
                onMouseLeave={() => dispatch(resetXobjs())}
                className={`table__item ${highlight ? `table__item--highlight` : ''}`}
                key={item.id}
              >
                {item.amount}
              </td>
            )
          });
        }
        obj.forEach((item, index) => {
          sum += item.amount;
          nColumns[index].unshift(item);
        });
        nColumn.unshift(
          <td 
            className="table__item" 
            key={Date.now()}
            onClick={() => handleDelete(i)}
          >&times;</td>
        )
        const sumConst = sum;
        nColumn.push(
          <td 
            className="table__item table__item--sum"
            key={sum}
            onMouseOut={() => dispatch(resetPercentages())}
            onMouseOver={() => dispatch(setPercentages(sumConst, i))}
          >
             {sum}
          </td>
        )
        return (
          <tr className="table__row" key={i*10*Date.now()}>
            {nColumn}
          </tr>
        );
      }));

      nColumns = nColumns.map(n => n.slice(0, objs.length));
      nColumns.forEach((nCol, idx) => {
        sum = 0;
        nCol.forEach(itemNcol => {
          sum += itemNcol.amount;
        });
        tFoot.push(
          <td className="table__item table__item--foot" key={sum * idx * Date.now()}>{Math.round(sum / nCol.length)}</td>
        )
      });
      tFoot.unshift(<td className="table__item" key={Date.now()}></td>);
      tFoot.push(<td className="table__item" key={Date.now() + 1}></td>);
      setFootTable(tFoot);
    }
  }, [objs, highlightObjects, rowPercentages, dispatch, handleAdd, handleDelete, xValue]);

  return (
    <>
      {objs.length && (
        <table className='table'>
        <tbody className='table__body'>
          {mRows}
        </tbody>
        <tfoot>
          <tr>
            {footTable}
          </tr>
        </tfoot>
      </table>
      )}
    </>
  );
};