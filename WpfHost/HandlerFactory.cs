using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;

namespace WpfHost
{
    public static class HandlerFactory
    {
        public static async Task HandleDrawFunction(string json, dynamic webView)
        {
            var data = JsonConvert.DeserializeObject<Message<DrawFunctionPayload>>(json);

            var points = await Task.Run(() => new SendPoints(data.payload.function).SetPoint());

            PostMessage(webView, new
            {
                type = "DRAW_RESULT",
                payload = new { points }
            });
        }

        public static async Task HandleFindPoint(string json, dynamic webView)
        {
            var data = JsonConvert.DeserializeObject<Message<FunctionPayloadBase>>(json);
            if (data?.payload == null)
            {
                PostMessage(webView, new { type = "POINT_RESULT_ERROR", payload = new { message = "Invalid payload" } });
                return;
            }

            var func = Utils.CreateEvaluatorFunction(data.payload.function);

            try
            {
                double root = await Task.Run(() =>
                {
                    var dichotomy = new Dichotomy(
                        func,
                        data.payload.ratioA,
                        data.payload.ratioB,
                        data.payload.epsilon
                    );

                    double fa = func(data.payload.ratioA);
                    double fb = func(data.payload.ratioB);

                    if (Math.Sign(fa) == Math.Sign(fb))
                        throw new Exception("Функция не имеет корна на данном интервале");

                    return dichotomy.FindRoot();
                });

                PostMessage(webView, new
                {
                    type = "POINT_RESULT",
                    payload = new { points = new double[] { root, func(root) } }
                });
            }
            catch (Exception ex)
            {
                PostMessage(webView, new
                {
                    type = "POINT_RESULT_ERROR",
                    payload = new { message = ex.Message }
                });
            }
        }

        public static async Task HandleFindPointGoldenSection(string json, dynamic webView)
        {
            var data = JsonConvert.DeserializeObject<Message<FindPointGoldenSectionPayload>>(json);
            if (data?.payload == null)
            {
                PostMessage(webView, new
                {
                    type = "GOLDENSECTION_RESULT_ERROR",
                    payload = new { message = "Invalid payload" }
                });
                return;
            }

            var func = Utils.CreateEvaluatorFunction(data.payload.function);

            try
            {
                double xExtremum = await Task.Run(() =>
                {
                    // Проверка интервала
                    if (data.payload.ratioA >= data.payload.ratioB)
                        throw new Exception("Левая граница должна быть меньше правой границы");

                    var solver = new GoldenSection(
                        func,
                        data.payload.ratioA,
                        data.payload.ratioB,
                        data.payload.isMaximum ? ExtremumType.Maximum : ExtremumType.Minimum,
                        data.payload.epsilon
                    );

                    double result = solver.FindExtremum();

                    // Проверка на NaN
                    if (double.IsNaN(result))
                        throw new Exception("Не удалось найти экстремум на данном интервале");

                    return result;
                });

                // Отправка успешного результата на React
                PostMessage(webView, new
                {
                    type = "GOLDENSECTION_RESULT",
                    payload = new { x = xExtremum, y = func(xExtremum) }
                });
            }
            catch (Exception ex)
            {
                // Отправка ошибки на React
                PostMessage(webView, new
                {
                    type = "GOLDENSECTION_RESULT_ERROR",
                    payload = new { message = ex.Message }
                });
            }
        }

        public static async Task HandleFindPointNewton(string json, dynamic webView)
        {
            var data = JsonConvert.DeserializeObject<Message<FindPointNewtonPayload>>(json);
            if (data?.payload == null)
            {
                PostMessage(webView, new
                {
                    type = "NEWTON_RESULT_ERROR",
                    payload = new { message = "Invalid payload" }
                });
                return;
            }

            try
            {
                var func = Utils.CreateEvaluatorFunction(data.payload.function);
                var fEval = new FunctionEvaluator(data.payload.function);

                Func<double, double> funcPrime = x => Utils.NumericalDerivative(fEval, x, 1e-6);
                Func<double, double> funcDoublePrime = x => Utils.NumericalDerivative(fEval, x, 1e-4, true);

                double xMin = await Task.Run(() =>
                {
                    // Проверка интервала
                    if (data.payload.ratioA >= data.payload.ratioB)
                        throw new Exception("Левая граница должна быть меньше правой границы");

                    var newton = new Newton(
                        func,
                        funcPrime,
                        funcDoublePrime,
                        data.payload.initialGuess,
                        data.payload.ratioA,
                        data.payload.ratioB,
                        data.payload.epsilon
                    );

                    double result = newton.FindMinimum();

                    // Проверка на NaN
                    if (double.IsNaN(result))
                        throw new Exception("Не удалось найти минимум на данном интервале");

                    return result;
                });

                // Отправка успешного результата на React
                PostMessage(webView, new
                {
                    type = "NEWTON_RESULT",
                    payload = new { x = xMin, y = func(xMin) }
                });
            }
            catch (Exception ex)
            {
                // Отправка ошибки на React
                PostMessage(webView, new
                {
                    type = "NEWTON_RESULT_ERROR",
                    payload = new { message = ex.Message }
                });
            }
        }



        public static async Task HandleSortArray(string json, dynamic webView)
        {
            var data = JsonConvert.DeserializeObject<Message<SortArrayPayload>>(json);

            var result = await Task.Run(() =>
            {
                var sorter = new Sorting(data.payload.Array);
                var results = new Dictionary<string, int[]>();
                var times = new Dictionary<string, long>();

                foreach (var method in data.payload.Methods)
                {
                    var stopwatch = Stopwatch.StartNew();

                    int[] sorted;

                    switch (method)
                    {
                        case "bubble":
                            sorted = sorter.BubbleSort(data.payload.Ascending);
                            break;
                        case "insert":
                            sorted = sorter.InsertionSort(data.payload.Ascending);
                            break;
                        case "shaker":
                            sorted = sorter.ShakerSort(data.payload.Ascending);
                            break;
                        case "quick":
                            sorted = sorter.QuickSort(data.payload.Ascending);
                            break;
                        case "bogo":
                            sorted = sorter.BogoSort(data.payload.Ascending);
                            break;
                        default:
                            sorted = data.payload.Array;
                            break;
                    }

                    stopwatch.Stop();
                    results[method] = sorted;
                    times[method] = stopwatch.ElapsedMilliseconds;
                }

                return new { results, times };
            });
            

            PostMessage(webView, new
            {
                type = "SORT_RESULT",
                payload = result
            });
        }


        private static void PostMessage(dynamic webView, object message)
        {
            string json = JsonConvert.SerializeObject(message);
            webView.CoreWebView2.PostWebMessageAsJson(json);
        }
    }
}
