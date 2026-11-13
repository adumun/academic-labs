package cl.adumun.dsy1105.supportdesk;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TicketApiIntegrationTest {
    @Autowired MockMvc mvc;

    @Test
    void supportsTicketCrudAndValidation() throws Exception {
        String request = """
            {
              "title":"Prueba de integración",
              "description":"Ticket creado desde MockMvc",
              "category":"Acceso",
              "priority":"ALTA",
              "requester":"Estudiante"
            }
            """;

        String response = mvc.perform(post("/api/tickets")
                .contentType(MediaType.APPLICATION_JSON).content(request))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.status").value("ABIERTO"))
            .andReturn().getResponse().getContentAsString();

        String id = com.jayway.jsonpath.JsonPath.read(response, "$.id").toString();

        mvc.perform(get("/api/tickets/{id}", id))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Prueba de integración"));

        String update = """
            {
              "title":"Prueba actualizada",
              "description":"Descripción editada",
              "category":"Aplicación",
              "priority":"MEDIA",
              "requester":"Estudiante"
            }
            """;
        mvc.perform(put("/api/tickets/{id}", id).contentType(MediaType.APPLICATION_JSON).content(update))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value("Prueba actualizada"));

        mvc.perform(patch("/api/tickets/{id}/status", id)
                .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"EN_PROCESO\"}"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("EN_PROCESO"));

        mvc.perform(delete("/api/tickets/{id}", id)).andExpect(status().isNoContent());
        mvc.perform(get("/api/tickets/{id}", id)).andExpect(status().isNotFound());

        mvc.perform(post("/api/tickets").contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"\",\"description\":\"x\",\"category\":\"General\",\"priority\":\"ALTA\",\"requester\":\"Test\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.fields.title").exists());
    }
}