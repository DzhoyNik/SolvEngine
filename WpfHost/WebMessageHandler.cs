using Microsoft.Web.WebView2.Core;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;
using System.Windows;

namespace WpfHost
{
    public class WebMessageHandler
    {
        private readonly dynamic _webView;

        public WebMessageHandler(dynamic webView)
        {
            _webView = webView;
        }

        public async void OnWebMessageReceived(object sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            try
            {
                var json = e.TryGetWebMessageAsString();
                dynamic msg = JsonConvert.DeserializeObject(json);
                string type = msg?.type;

                switch (type)
                {
                    case "getData":
                        await SendMessageAsync(new { type = "data", seq = msg.seq, payload = new { now = DateTime.Now.ToString() } });
                        break;

                    case "fullScreen":
                        SetFullScreen(true);
                        break;

                    case "exitFullScreen":
                        SetFullScreen(false);
                        break;

                    case "DRAW_FUNCTION":
                        HandlerFactory.HandleDrawFunction(json, _webView);
                        break;

                    case "FIND_POINT":
                        HandlerFactory.HandleFindPoint(json, _webView);
                        break;

                    case "FIND_POINT_GOLDSECTION":
                        HandlerFactory.HandleFindPointGoldenSection(json, _webView);
                        break;

                    case "FIND_POINT_NEWTON":
                        HandlerFactory.HandleFindPointNewton(json, _webView);
                        break;

                    case "SORT_ARRAY":
                        HandlerFactory.HandleSortArray(json, _webView);
                        break;

                    default:
                        Console.WriteLine($"Unknown message type: {type}");
                        break;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error processing message: " + ex);
            }
        }

        private void SetFullScreen(bool fullscreen)
        {
            var window = Application.Current.MainWindow;
            if (fullscreen)
            {
                window.WindowState = WindowState.Maximized;
                window.WindowStyle = WindowStyle.None;
                window.ResizeMode = ResizeMode.NoResize;
            }
            else
            {
                window.WindowState = WindowState.Normal;
                window.WindowStyle = WindowStyle.SingleBorderWindow;
                window.ResizeMode = ResizeMode.CanResize;
            }
        }

        private async Task SendMessageAsync(object message)
        {
            string json = JsonConvert.SerializeObject(message);
            await _webView.CoreWebView2.ExecuteScriptAsync($"window.onHostMessage({json})");
        }
    }
}
