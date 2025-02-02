from pyvis.network import Network
import pandas as pd
import os

graph_df = pd.read_csv("relationship_extraction/wikileaks_network.csv")
graph_df['Entities'] = graph_df['Entities'].apply(eval)
graph_df['Relationships'] = graph_df['Relationships'].apply(eval)

# Define dynamic color scheme
node_colors = {
"PER": "#FFA500",  # Orange
"ORG": "#007BFF",  # Blue
"LOC": "#8E44AD",  # Purple
"EVT": "#1ABC9C",  # Teal
"MISC": "#BDC3C7"  # Grey
}

relationship_colors = {
"PV": "#27AE60",  # Green (Positive)
"NG": "#E74C3C",  # Red (Negative)
"NE": "#D3D3D3"   # Light Grey (Neutral)
}

for ind, row in graph_df.iterrows():
    pdf = row['PDF'][:-4]
    pdf = pdf.zfill(3)
    entities = row["Entities"]
    relationships = row["Relationships"]
    for ent1, ent2, rs, classification in relationships:
        if ent1 not in [entity for entity, _ in entities]:
            entities.append((ent1, "MISC"))
        if ent2 not in [entity for entity, _ in entities]:
            entities.append((ent2, "MISC"))
    
    # Create PyVis Network
    net = Network(width="100%", height="100vh", notebook=True, directed=True, cdn_resources='remote', bgcolor='#222222', font_color='white')

    # Add nodes with color-coded styles
    for entity, classification in entities:
        color = node_colors.get(classification, "#BDC3C7") 
        net.add_node(entity, label=entity, size=30, borderWidth=4, borderWidthSelected=8,
                        color={"highlight": {"border": color}, "background": color, "border": color},
                        font={'size': 18, 'color': 'white'})

    # Add edges with relationship colors
    for source, target, rs, classification in relationships:
        net.add_edge(source, target, label=rs, width=5,
                    font={'size': 14, 'align': 'middle', 'color': 'white', "strokeColor": "rgba(0,0,0,0)", "vadjust": -10},
                    color=relationship_colors.get(classification, "#FFFFFF"))

    # Improve physics settings for better visualization
    net.set_options("""
    var options = {
    "physics": {
        "barnesHut": {
            "gravitationalConstant": -5050,
            "centralGravity": 0.75,
            "springLength": 180,
            "damping": 0.5,
            "avoidOverlap": 1
        }
    }
    }
    """)


    file_path = f"graphs_wikileaks/graph_{pdf}.html"
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    net.show(file_path)

    # Inject **DYNAMIC LEGEND** into HTML file
    legend_html = f"""
    <style>
        .legend {{
            position: absolute;
            top: 20px;
            right: 20px;
            background: white;
            padding: 10px;
            border-radius: 5px;
            font-size: 14px;
            font-family: Arial, sans-serif;
            z-index: 1000;
        }}
        .legend-item {{
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }}
        .legend-color {{
            width: 15px;
            height: 15px;
            margin-right: 5px;
            border-radius: 3px;
        }}
    </style>
    <div class="legend">
        <strong>Legend</strong>
        <div class="legend-item"><div class="legend-color" style="background:{node_colors["PER"]}"></div>Person (PER)</div>
        <div class="legend-item"><div class="legend-color" style="background:{node_colors["ORG"]}"></div>Organisation (ORG)</div>
        <div class="legend-item"><div class="legend-color" style="background:{node_colors["LOC"]}"></div>Location (LOC)</div>
        <div class="legend-item"><div class="legend-color" style="background:{node_colors["EVT"]}"></div>Event (EVT)</div>
        <div class="legend-item"><div class="legend-color" style="background:{node_colors["MISC"]}"></div>Miscellaneous (MISC)</div>
        <hr>
        <div class="legend-item"><div class="legend-color" style="background:{relationship_colors["PV"]}"></div>Positive (PV)</div>
        <div class="legend-item"><div class="legend-color" style="background:{relationship_colors["NG"]}"></div>Negative (NG)</div>
        <div class="legend-item"><div class="legend-color" style="background:{relationship_colors["NE"]}"></div>Neutral (NE)</div>
    </div>
    """

    # Append dynamic legend to HTML file
    with open(file_path, "a") as f:
        f.write(legend_html)