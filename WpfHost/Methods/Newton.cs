using System;

public class Newton
{
    private readonly Func<double, double> _func;
    private readonly Func<double, double> _fPrime;
    private readonly Func<double, double> _fDoublePrime;
    private readonly double _initialGuess;
    private readonly double _epsilon;
    private readonly double _a;
    private readonly double _b;
    private const int MaxIterations = 1000;

    public Newton(Func<double, double> func, Func<double, double> fPrime, Func<double, double> fDoublePrime,
                  double initialGuess, double a, double b, double epsilon)
    {
        _func = func ?? throw new ArgumentNullException(nameof(func));
        _fPrime = fPrime ?? throw new ArgumentNullException(nameof(fPrime));
        _fDoublePrime = fDoublePrime ?? throw new ArgumentNullException(nameof(fDoublePrime));
        _initialGuess = initialGuess;
        _a = a;
        _b = b;
        _epsilon = epsilon > 0 ? epsilon : throw new ArgumentException("Epsilon must be positive.");
    }

    public double FindMinimum()
    {
        double x = _initialGuess;

        for (int i = 0; i < MaxIterations; i++)
        {
            double f1 = _fPrime(x);
            double f2 = _fDoublePrime(x);

            if (double.IsNaN(f1) || double.IsNaN(f2))
                throw new Exception("Derivative evaluation returned NaN.");

            if (Math.Abs(f2) < 1e-12)
                throw new Exception("Second derivative too small, Newton method fails.");

            double step = f1 / f2;
            x -= step;

            if (x < _a) x = _a;
            if (x > _b) x = _b;

            if (Math.Abs(step) < _epsilon)
                return x;
        }

        throw new Exception("Newton method did not converge within maximum iterations.");
    }
}
