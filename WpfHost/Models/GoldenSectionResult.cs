using System.Collections.Generic;

public class GoldenSectionResult
{
    public bool Success { get; set; }
    public string Error { get; set; }
    public double X { get; set; }
    public double Y { get; set; }
    public List<(double x, double y)> Points { get; set; }

    public GoldenSectionResult()
    {
        Points = new List<(double x, double y)>();
    }
}
