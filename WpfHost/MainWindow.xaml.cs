using System;
using System.Windows;

namespace WpfHost
{
    public partial class MainWindow : Window
    {
        private WebMessageHandler _messageHandler;

        public MainWindow()
        {
            InitializeComponent();
            Loaded += MainWindow_Loaded;
        }

        private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            await webView.EnsureCoreWebView2Async();
            webView.Source = new Uri("http://localhost:3000");

            _messageHandler = new WebMessageHandler(webView);
            webView.CoreWebView2.WebMessageReceived += _messageHandler.OnWebMessageReceived;
        }
    }
}
