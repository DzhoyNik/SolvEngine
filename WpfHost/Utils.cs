using System;

namespace WpfHost
{
    public static class Utils
    {
        public static Func<double, double> CreateEvaluatorFunction(string function)
        {
            var evaluator = new FunctionEvaluator(function);
            return x =>
            {
                var val = evaluator.Evaluate(x);
                if (!val.HasValue)
                    throw new Exception($"Функция не определена в x={x}");
                return val.Value;
            };
        }

        public static double NumericalDerivative(FunctionEvaluator fEval, double x, double h, bool secondDerivative = false)
        {
            if (secondDerivative)
            {
                double fxh1 = fEval.Evaluate(x + h) ?? throw new Exception($"Функция не определена в x={x + h}");
                double fx = fEval.Evaluate(x) ?? throw new Exception($"Функция не определена в x={x}");
                double fxh2 = fEval.Evaluate(x - h) ?? throw new Exception($"Функция не определена в x={x - h}");
                return (fxh1 - 2 * fx + fxh2) / (h * h);
            }
            else
            {
                double fxh1 = fEval.Evaluate(x + h) ?? throw new Exception($"Функция не определена в x={x + h}");
                double fxh2 = fEval.Evaluate(x - h) ?? throw new Exception($"Функция не определена в x={x - h}");
                return (fxh1 - fxh2) / (2 * h);
            }
        }
    }
}
