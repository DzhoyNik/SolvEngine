using NCalc;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text.RegularExpressions;

public class FunctionEvaluator
{
    private readonly Expression _expression;

    // Словарь функций
    private static readonly Dictionary<string, Func<double[], double>> Functions = new Dictionary<string, Func<double[], double>>()
    {
        { "sin", p => Math.Sin(p[0]) },
        { "cos", p => Math.Cos(p[0]) },
        { "tg", p => Math.Tan(p[0]) },
        { "tan", p => Math.Tan(p[0]) },
        { "ctg", p => 1.0 / Math.Tan(p[0]) },
        { "cot", p => 1.0 / Math.Tan(p[0]) },
        { "sqrt", p => Math.Sqrt(p[0]) },
        { "abs", p => Math.Abs(p[0]) },
        { "ln", p => Math.Log(p[0]) },
        { "log", p => Math.Log10(p[0]) },
        { "pow", p => Math.Pow(p[0], p[1]) }
    };

    // Regex для обработки "^"
    private static readonly Regex PowerRegex = new Regex(
        @"(?<base>\([^\)]+\)|[0-9\.xepi]+)\s*\^\s*(?<exp>\([^\)]+\)|[0-9\.xepi]+)",
        RegexOptions.Compiled | RegexOptions.IgnoreCase
    );

    public FunctionEvaluator(string function)
    {
        if (string.IsNullOrWhiteSpace(function))
            throw new ArgumentException("Функция не может быть пустой", nameof(function));

        string processedFunction = ReplacePower(function.ToLower());

        _expression = new Expression(processedFunction);

        _expression.EvaluateFunction += (name, args) =>
        {
            string fname = name.ToLower();

            Func<double[], double> func;
            if (!Functions.TryGetValue(fname, out func))
                throw new ArgumentException($"Неизвестная функция: {name}");

            double[] parameters = new double[args.Parameters.Length];
            for (int i = 0; i < args.Parameters.Length; i++)
                parameters[i] = Convert.ToDouble(args.Parameters[i].Evaluate(), CultureInfo.InvariantCulture);

            args.Result = func(parameters);
        };

        // Константы
        _expression.Parameters["e"] = Math.E;
        _expression.Parameters["pi"] = Math.PI;
    }

    public double? Evaluate(double x)
    {
        _expression.Parameters["x"] = x;

        try
        {
            double result = Convert.ToDouble(_expression.Evaluate(), CultureInfo.InvariantCulture);
            if (double.IsNaN(result) || double.IsInfinity(result))
                return null;
            return result;
        }
        catch
        {
            return null;
        }
    }

    private static string ReplacePower(string input)
    {
        return PowerRegex.Replace(input, "Pow(${base},${exp})");
    }
}
