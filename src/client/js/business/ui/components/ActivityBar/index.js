/* eslint react/no-array-index-key: 0 */

import styled from 'emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {onlyUpdateForKeys} from 'recompose';
import {bindActionCreators} from 'redux';

import actions from '../../actions/sideBar';

import MenuButton from './MenuButton';
import {menuContent, modalContent} from '../iconDefinition';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #d2d2d6;
    justify-content: space-between;
`;

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px 0 20px 0;
`;

class ActivityBar extends React.Component {
    toggleSideBarElement = (index) => {
        const {selectedIndex, status, duration, setIndex, setStatus} = this.props;

        // animation management
        // closing
        if (selectedIndex === index) {
            setStatus('closing');
            setTimeout(() => {
                setStatus('closed');
            }, duration);
        }
        // opening
        // only launch animation if not already opened
        else {
            // set index
            setIndex(index);
            if (status !== 'opened') {
                setStatus('opening');
                setTimeout(() => setStatus('opened'), duration);
            }
        }
    };
    openModalElement = (index) => {
        // Add function to open element
        console.log(index);
    };

    render() {
        const {selectedIndex} = this.props;

        return <Container>
            <ButtonGroup>
                {menuContent.map(({icon, name}, index) =>
                    <MenuButton
                        key={name}
                        index={index}
                        active={selectedIndex === index}
                        icon={icon}
                        onClick={this.toggleSideBarElement}
                    />,
                )}
            </ButtonGroup>
            <ButtonGroup>
                {modalContent.map(({icon, name}, index) =>
                    <MenuButton
                        key={name}
                        index={index}
                        icon={icon}
                        onClick={this.openModalElement}
                    />,
                )}
            </ButtonGroup>
        </Container>;
    }
}


ActivityBar.propTypes = {
    setIndex: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired,

    selectedIndex: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
};

const mapStateToProps = ({parameters}) => ({
    selectedIndex: parameters.sideBar.selectedIndex,
    status: parameters.sideBar.status,
    duration: parameters.sideBar.duration,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setIndex: actions.setIndex,
    setStatus: actions.setStatus,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(onlyUpdateForKeys(['selectedIndex', 'status'])(ActivityBar));