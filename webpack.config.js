module.exports = {
    entry: './src/js/app.jsx',
    output: {
        path: './build',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, loader: 'jsx-loader?harmony' },
            { test: /\.scss$/, loader: 'style!css!sass' },
            { test: /\.jpg$/, loader: 'url-loader?limit=10000&minetype=image/jpg' }
        ]
    }
}
