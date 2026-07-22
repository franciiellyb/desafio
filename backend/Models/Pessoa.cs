using MeuTodo.Models;

public class  Pessoa
{
	public Guid Id { get; private set; } = Guid.NewGuid();
    public string Nome { get; set; }
    public int Idade { get; set; }

    public Pessoa(string nome, int idade)
    {
        Nome = nome;
        this.Idade = idade;
    }

}