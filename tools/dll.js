import webpack from 'webpack';
import webpackConfig from '../webpack/dll';

function dll() {
    return new Promise((resolve, reject) => {
        webpack(webpackConfig).run((err, stats) => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
}

export default dll;
