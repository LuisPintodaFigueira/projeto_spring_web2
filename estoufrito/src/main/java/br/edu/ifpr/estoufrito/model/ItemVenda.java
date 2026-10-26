import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Entity
public class ItemVenda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int produtoId;
    private String nomeProduto;
    private int quantidade;
    private float precoUnitario;
    private float custoUnitario;

    @ManyToOne
    @JoinColumn(name = "venda_id")
    private Venda venda;

    public ItemVenda() {
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public int getProdutoId() {
        return produtoId;
    }
    public void setProdutoId(int produtoId) {
        this.produtoId = produtoId;
    }

    public String getNomeProduto() {
        return nomeProduto;
    }
    public void setNomeProduto(String nomeProduto) {
        this.nomeProduto = nomeProduto;
    }

    public int getQuantidade() {
        return quantidade;
    }
    public void setQuantidade(int quantidade) {
        this.quantidade = quantidade;
    }

    public float getPrecoUnitario() {
        return precoUnitario;
    }
    public void setPrecoUnitario(float precoUnitario) {
        this.precoUnitario = precoUnitario;
    }

    public float getCustoUnitario() {
        return custoUnitario;
    }
    public void setCustoUnitario(float custoUnitario) {
        this.custoUnitario = custoUnitario;
    }

    public Venda getVenda() {
        return venda;
    }
    public void setVenda(Venda venda) {
        this.venda = venda;
    }
    
}