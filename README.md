# Portfolio

[![Demo](https://i.imgur.com/vEzx9UY.png)](https://imgur.com/vEzx9UY.png)

CodeInsight is the ultimate destination for code execution and analysis. Tailored for developers, this platform provides comprehensive support across various programming languages. With an intuitive interface and powerful features, users can execute code swiftly while scrutinizing its performance. CodeInsight enables users to uncover optimization prospects and enhancements effortlessly, offering a seamless experience where coding meets insight.

## Installation Guide

This section provides detailed instructions on how to set up and build the portfolio project for both development and production environments.

### Development Mode

To get started with development mode, follow these steps:

1. **Clone the Repository**: First, clone the repository to your local machine using Git:

   ```bash
   git clone https://github.com/kaldimitrov/CodeInsight.git
   cd CodeInsight
   ```

2. **Install Dependencies**: Once inside the project directory, install the necessary dependencies:

   ```bash
   npm install
   ```

3. **Start the Development Server**: After the dependencies are installed, start the development server:

   ```bash
    npm run dev
   ```

4. **Access the App**: The development server will start, usually on port 5173. Open your web browser and navigate to http://localhost:5173. During development mode, any changes you make to the source code will automatically be reflected in the browser, thanks to Svelte’s hot module replacement.

### Building for Production

When you’re ready to build your app for production, follow these steps:

1. **Build the App**: First, build the app for production using the following command:

   ```bash
   npm run build
   ```

   This command will optimize your app for the best performance: the build is minified, and the filenames include hashes for efficient caching.

2. **Serve the App**: After the build is complete, you will be provided with a javascript file, which you can use to server the application through a proxy like nginx.

## License

This project is licensed under the MIT License. This implies that you are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, given that you include the original copyright notice and the permission notice in all copies or substantial portions of the software. For more information, please see the [LICENSE](LICENSE) file in our project repository or visit the Open Source Initiative website.
