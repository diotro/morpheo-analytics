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

/* globals STORAGE_API_URL STORAGE_USER STORAGE_PASSWORD btoa fetch */

import queryString from 'query-string';
import {isEmpty} from 'lodash';
import {handleResponse} from '../../../entities/fetchEntities';

const getHeaders = jwt => ({
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: `Basic ${jwt}`,
});

export const fetchItem = (url, jwt) => fetch(url, {
    headers: getHeaders(jwt),
    mode: 'cors',
})
    .then(response => handleResponse(response))
    .then(json => ({item: json}), error => ({error}));

export const fetchProblem = (id, get_parameters) => {
    const url = `${STORAGE_API_URL}/problem/${id}${!isEmpty(get_parameters) ? `?${queryString.stringify(get_parameters)}` : ''}`;
    const jwt = btoa(`${STORAGE_USER}:${STORAGE_PASSWORD}`);
    return fetchItem(url, jwt);
};

