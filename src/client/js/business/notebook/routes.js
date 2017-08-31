/**
 * Copyright Morpheo Org. 2017
 *
 * contact@morpheo.co
 *
 * This software is part of the Morpheo project, an open-source machine
 * learning platform.
 *
 * This software is governed by the CeCILL license, compatible with the
 * GNU GPL, under French law and abiding by the rules of distribution of
 * free software. You can  use, modify and/ or redistribute the software
 * under the terms of the CeCILL license as circulated by CEA, CNRS and
 * INRIA at the following URL "http://www.cecill.info".
 *
 * As a counterpart to the access to the source code and  rights to copy,
 * modify and redistribute granted by the license, users are provided only
 * with a limited warranty  and the software's author,  the holder of the
 * economic rights,  and the successive licensors  have only  limited
 * liability.
 *
 * In this respect, the user's attention is drawn to the risks associated
 * with loading,  using,  modifying and/or developing or reproducing the
 * software by the user in light of its specific status of free software,
 * that may mean  that it is complicated to manipulate,  and  that  also
 * therefore means  that it is reserved for developers  and  experienced
 * professionals having in-depth computer knowledge. Users are therefore
 * encouraged to load and test the software's suitability as regards their
 * requirements in conditions enabling the security of their systems and/or
 * data to be ensured and,  more generally, to use and operate it in the
 * same conditions as regards security.
 *
 * The fact that you are presently reading this means that you have had
 * knowledge of the CeCILL license and that you accept its terms.
 */

import React from 'react';
import universal from 'react-universal-component';
import {injectReducer} from 'redux-injector';
import {injectSaga} from 'redux-sagas-injector';
import PulseLoader from '../common/components/presentation/loaders/pulseLoader';
import {connect} from 'react-redux';

import localStorage from '../../../../common/localStorage';

import theme from '../../../css/variables';

// second way with onLoad
const Universal = universal(import('./preload'), {
    loading: <PulseLoader size={6} color={theme['primary-color']}/>,
    onLoad: (preload) => {
        injectSaga('notebook', preload.notebookSagas);
        injectSaga('settings', preload.settingsSagas);
        injectReducer('notebook', preload.notebookReducer);
        injectReducer('settings', preload.settingsReducer(localStorage));
    },
});

const mapStateToProps = ({user}, ownProps) => ({user, ...ownProps});

export default connect(mapStateToProps)((props) => {
    const {user} = props;
    return user && user.authenticated && typeof window !== 'undefined' ? <Universal/> : null;
});