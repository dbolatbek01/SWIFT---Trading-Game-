package Swift.Backend.Swift.Entities;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Index {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_index")
    private long id;

    @Column(name = "name")
    private String indexname;

    @Column(name = "shortname")
    private String shortname;

    public Index(long id, String indexname, String shortname){
        this.id = id; this.indexname = indexname; this.shortname = shortname;
    }
    
    public Index(){
    }

    public long getId(){
        return id;
    }

    public void setId(long id){
        this.id = id;
    }

    public String getIndexname(){
        return indexname;
    }

    public void setIndexname(String indexname){
        this.indexname = indexname;
    }

    public String getShortname(){
        return shortname;
    }

    public void setShortname(String shortname){
        this.shortname = shortname;
    } 
}

/*
Index:
ID int,
Indexname String,
Indexkuerzel String
 */
