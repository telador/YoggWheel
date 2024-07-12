import path from 'path'

export default {
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, "index.html"),
                wheel: path.resolve(__dirname, "wheel.html"),
                wheel_viewer: path.resolve(__dirname, "wheel_viewer.html"),
                popover: path.resolve(__dirname, "popover.html")
            }
        }
    }
}