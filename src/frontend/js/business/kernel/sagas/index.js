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

/* globals API_SOCKET_URL, WebSocket */
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-constant-condition: ["error", { "checkLoops": false }] */
import {call, fork, put, take, takeLatest} from 'redux-saga/effects';
import {eventChannel} from 'redux-saga';
import sendSagas from './send';

import {
    close as closeActions,
    connect as connectActions,
    create as createActions,
    message as messageActions,
    actionTypes,
} from '../actions';
import {
    fetchCreateKernel as fetchCreateKernelApi,
    fetchConnectKernel as fetchConnectKernelApi,
} from '../api';

export const createKernel = fetchCreateKernel =>
    function* createKernelSagas({payload: {jwt}}) {
        const {error, res} = yield call(fetchCreateKernel, jwt);

        if (error) {
            yield put(createActions.failure(error));
        }
        else {
            const {id: kernel_id} = res;
            yield put(createActions.success({kernel_id}));

            // TODO remove the automatic socket connection
            yield put(connectActions.request({jwt, kernel_id}));
        }
    };

const subscribeSocketChannel = (socket, closeAfterReception = false) =>
    eventChannel((emit) => {
        socket.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data);
                emit(messageActions.receive(msg));
            }
            catch (e) {
                emit(messageActions.error(e.data));
            }
        };

        return () => {
            socket.onmessage = undefined;
        };
    });

function* receiveSocketMessage(socket) {
    const socketChannel = yield call(subscribeSocketChannel, socket, true);
    while (true) {
        const action = yield take(socketChannel);
        yield put(action);
    }
}


function* manageSocketMessage(socket) {
    yield fork(receiveSocketMessage, socket);
    yield fork(sendSagas, socket);
    // TODO Add closeSocket sagas
    // yield fork(closeSocket, socket);
}

export const connectKernel = fetchConnectKernel =>
    function* connectKernelSagas() {
        while (true) {
            const {payload: {jwt, kernel_id}} = yield take(actionTypes.connect.REQUEST);
            const socket = new WebSocket(`${API_SOCKET_URL}/api/kernels/${kernel_id}/channels`);
            const authenticateChannel = yield call(subscribeSocketChannel, socket, true);

            // Send authentication
            socket.onopen = () => socket.send(JSON.stringify({Authorization: `Bearer ${jwt}`}));

            // Validate authentication
            const {payload} = yield take(authenticateChannel);
            if (payload.connection !== 'validated') {
                yield put(connectActions.failure(payload));
            }
            else {
                yield put(connectActions.success());
                yield fork(manageSocketMessage, socket);
                yield take(actionTypes.close.REQUEST);
            }

            socket.close();
            yield put(closeActions.success());
        }
    };


/* istanbul ignore next */
const sagas = function* sagas() {
    yield [
        takeLatest(actionTypes.create.REQUEST, createKernel(fetchCreateKernelApi)),
        connectKernel(fetchConnectKernelApi)(),
    ];
};


export default sagas;
