import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Venda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime dataHora;
    private float totalVendido;
    private float lucroTotal;
    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL)
    private List<ItemVenda> itensVenda;

    public Venda() {
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }
    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public float getTotalVendido() {
        return totalVendido;
    }
    public void setTotalVendido(float totalVendido) {
        this.totalVendido = totalVendido;
    }

    public float getLucroTotal() {
        return lucroTotal;
    }
    public void setLucroTotal(float lucroTotal) {
        this.lucroTotal = lucroTotal;
    }

    public List<ItemVenda> getItensVenda() {
        return itensVenda;
    }
    public void setItensVenda(List<ItemVenda> itensVenda) {
        this.itensVenda = itensVenda;
    }

}