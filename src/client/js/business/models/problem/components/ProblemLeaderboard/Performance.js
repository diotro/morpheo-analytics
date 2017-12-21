import React from 'react';
import PropTypes from 'prop-types';
import {onlyUpdateForKeys} from 'recompose';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {css} from 'react-emotion';

import Trophy from '../../../../common/components/icons/Trophy';
import ChartLine from '../../../../common/components/icons/ChartLine';
import {getLChartData, getLeaderboardData} from '../../../learnuplet/selector';
import LChart from './LChart';


class Performance extends React.Component {
    style = css`
        display: flex;
        flex-direction: column;

        & span{
            padding-bottom: 10px;
        }
        min-width: 50%;
    `;

    render() {
        const {algorithmIndex, data, lChartData} = this.props;
        const {bestPerf, name} = data;
        return (<div
            css={this.style}
        >
            <span>Performances of <b>{name}</b></span>
            <span><Trophy />{algorithmIndex + 1}</span>
            <span><ChartLine />{(bestPerf * 100).toFixed(2)}%</span>
            <span><LChart data={lChartData} /></span>
        </div>);
    }
}

Performance.propTypes = {

};

Performance.defaultProps = {

};

const mapStateToProps = (state, {problemId, algorithmId}) => {
    const algorithmData = getLeaderboardData(state)[problemId];
    const algorithmUuid = algorithmId || algorithmData[0].uuid;
    const algorithmIndex = algorithmData.findIndex(
        ({uuid}) => uuid === algorithmUuid);
    return ({
        algorithmIndex,
        lChartData: getLChartData(state)[algorithmUuid],
        data: algorithmData[algorithmIndex],
    });
};

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators({

}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(onlyUpdateForKeys([
    'algorithmId',
])(Performance));
