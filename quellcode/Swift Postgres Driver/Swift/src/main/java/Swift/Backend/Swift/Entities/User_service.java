package Swift.Backend.Swift.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class User_service {
    @Id
    //@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_user")
    private String id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "profile_picture")
    private String profile_picture;

    @Column(name = "user_name")
    private String user_name;



    public User_service(String id, String name, String email, String profile_picture, String user_name){
        this.id = id; this.name = name; this.email = email; 
        this.profile_picture= profile_picture; this.user_name = user_name;
    }
    
    public User_service(){
    }

    public String getId(){
        return id;
    }

    public void setId(String id){
        this.id = id;
    }

    public String getName(){
        return name;
    }

    public void setName(String name){
        this.name = name;
    }

    public String getProfilePicture(){
        return profile_picture;
    }

    public void setProfilePicture(String profile_picture){
        this.profile_picture = profile_picture;
    } 

    public String getEmail(){
        return email;
    }

    public void setEmail(String email){
        this.email = email;
    } 

    public String getUsername(){
        return user_name;
    }

    public void setUsername(String user_name){
        this.user_name = user_name;
    } 
}
