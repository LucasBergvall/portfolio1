package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "item_tool")
public class ItemTool {
  @Id
  private Long ino;

  @OneToOne
  @MapsId
  @JoinColumn(name = "ino")
  private Item item;

  @OneToOne(mappedBy = "itemTool", cascade = CascadeType.ALL)
  private Tool tool;

  @OneToOne(mappedBy = "itemTool", cascade = CascadeType.ALL)
  private Inverter inverter;
}
