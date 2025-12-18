using System;

public class GoldenSection
{
    private readonly Func<double, double> _func;
    private readonly double _a;
    private readonly double _b;
    private readonly double _epsilon;
    private readonly ExtremumType _type;

    private const double Phi = 0.618033988749895; // Золотое сечение

    public GoldenSection(Func<double, double> func, double a, double b, ExtremumType type, double epsilon)
    {
        if (a >= b) throw new ArgumentException("Left boundary must be less than right boundary.");
        if (epsilon <= 0) throw new ArgumentException("Epsilon must be positive.");

        _func = func ?? throw new ArgumentNullException(nameof(func));
        _a = a;
        _b = b;
        _type = type;
        _epsilon = epsilon;
    }

    public double FindExtremum()
    {
        double a = _a;
        double b = _b;
        double x1 = b - Phi * (b - a);
        double x2 = a + Phi * (b - a);

        Func<double, double> eval = x => (_type == ExtremumType.Minimum) ? _func(x) : -_func(x);

        double f1 = eval(x1);
        double f2 = eval(x2);

        while ((b - a) > _epsilon)
        {
            if (double.IsNaN(f1) || double.IsNaN(f2))
                throw new Exception("Function evaluation returned NaN.");

            if (f1 < f2)
            {
                b = x2;
                x2 = x1;
                f2 = f1;
                x1 = b - Phi * (b - a);
                f1 = eval(x1);
            }
            else
            {
                a = x1;
                x1 = x2;
                f1 = f2;
                x2 = a + Phi * (b - a);
                f2 = eval(x2);
            }
        }

        return (a + b) / 2.0;
    }
}
