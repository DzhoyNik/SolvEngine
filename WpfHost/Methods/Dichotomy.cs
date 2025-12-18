using System;

public class Dichotomy
{
    private readonly Func<double, double> _func;
    private readonly double _a;
    private readonly double _b;
    private readonly double _epsilon;

    public Dichotomy(Func<double, double> func, double a, double b, double epsilon)
    {
        if (a >= b) throw new ArgumentException("Left boundary must be less than right boundary.");
        if (epsilon <= 0) throw new ArgumentException("Epsilon must be positive.");

        _func = func ?? throw new ArgumentNullException(nameof(func));
        _a = a;
        _b = b;
        _epsilon = epsilon;
    }

    public double FindRoot()
    {
        double left = _a;
        double right = _b;
        double mid = double.NaN;

        while ((right - left) / 2 > _epsilon)
        {
            mid = (left + right) / 2.0;
            double fMid = _func(mid);
            double fLeft = _func(left);

            if (double.IsNaN(fMid) || double.IsNaN(fLeft))
                throw new Exception("Function evaluation returned NaN.");

            if (fMid == 0.0) return mid;

            if (Math.Sign(fMid) == Math.Sign(fLeft))
                left = mid;
            else
                right = mid;
        }

        return (left + right) / 2.0;
    }
}
