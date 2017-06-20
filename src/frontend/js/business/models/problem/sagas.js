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
/* globals */

import {call, put, select, takeLatest} from 'redux-saga/effects';
import queryString from 'query-string';
import generalActions from '../../../app/actions';

import actions, {actionTypes} from './actions';
import {
    fetchProblems as fetchProblemsApi,
} from './api';

export const loadList = (actions, fetchList, q) =>
    function* loadListSaga() {
        const state = yield select(),
            location = state.routing.location;

        // override query if needed, default to current url query
        const query = q || (location && location.search ? queryString.parse(location.search) : {});

        const {error, list} = yield call(fetchList, query);

        if (error) {
            if (error.body && error.body.message) {
                console.error(error.body.message);
            }
            if (error && error.message) {
                yield put(generalActions.error.set(error.message));
            }
            yield put(actions.list.failure(error.body));
        }
        else {
            yield put(actions.list.success({results: list.problems}));
            return list;
        }
    };

/* istanbul ignore next */
const sagas = function* sagas() {
    yield [
        takeLatest(actionTypes.list.REQUEST, loadList(actions, fetchProblemsApi)),
    ];
};


export default sagas;
