public class Message<TPayload>
{
    public string type { get; set; }
    public TPayload payload { get; set; }
}