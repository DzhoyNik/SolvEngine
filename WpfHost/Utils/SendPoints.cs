using System;
using System.Collections.Generic;

class SendPoints
{
    private readonly FunctionEvaluator _evaluator;

    public SendPoints(string function)
    {
        _evaluator = new FunctionEvaluator(function);
    }

    public List<(double x, double? y)> SetPoint
    (
        double start = -50,
        double end = 50,
        double step = 0.1
    )
    {
        var points = new List<(double x, double? y)>();
        int steps = (int)((end - start) / step);

        try
        {
            for (int i = 0; i <= steps; i++)
            {
                double x = start + i * step;
                double? y = _evaluator.Evaluate(x);

                if (y == null || double.IsInfinity(y.Value))
                    y = null;

                points.Add((x, y));
            }
        }
        catch
        {
            Console.WriteLine("Ошибка");
        }

        return points;
    }
}